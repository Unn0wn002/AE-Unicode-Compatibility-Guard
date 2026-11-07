"use strict";
// Real collector/core with controlled AE test doubles; NOT native host evidence.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "src", "UCG_Probe.jsx"), "utf8");
const core = source.match(/\/\/ <UCG_CORE>([\s\S]*?)\/\/ <\/UCG_CORE>/);
const safe = source.match(/function safe\(fn, fallback\) \{[^\r\n]+\}/);
const start = source.indexOf("    function collectItems() {");
const end = source.indexOf("    function scan() {", start);
assert.ok(core && safe && start !== -1 && end > start, "collector/core boundaries missing");
const FootageItem = class {};
const FileSource = class {};
const plain = value => JSON.parse(JSON.stringify(value));

function functions(project) {
    const lines = [];
    const ctx = { app: { project, version: "controlled-test-double" }, FootageItem, FileSource,
        $: { writeln: line => lines.push(line) } };
    vm.createContext(ctx);
    vm.runInContext(core[1] + "\n" + safe[0] + "\n" +
        source.slice(start, source.indexOf("    function codeText", end)), ctx);
    return { ctx, lines };
}

function collect(project) {
    const { ctx } = functions(project);
    const collection = ctx.collectItems();
    // Accept the old array only to reproduce missing coverage against the pre-fix source.
    const items = Array.isArray(collection) ? collection : collection.items;
    const results = items.map(item => ctx.ucgEvaluatePath(item));
    return { items: plain(items), coverage: collection.coverage,
        collectionFailures: collection.collectionFailures && plain(collection.collectionFailures),
        overall: ctx.ucgOverall(results, collection.coverage === "COMPLETE") };
}

function scanProject(project) {
    const { ctx, lines } = functions(project);
    const report = plain(ctx.scan());
    assert.deepEqual(JSON.parse(lines[0]), report, "console JSON must retain the complete report");
    return report;
}

function projectWithOutputs(outputs, queried) {
    return {
        file: { fsName: "D:/Fixture/project.aep", exists: true },
        numItems: 0,
        renderQueue: {
            numItems: outputs.length,
            item(queueIndex) {
                assert.ok(queueIndex >= 1 && queueIndex <= outputs.length, "queue index out of range");
                const modules = outputs[queueIndex - 1];
                return {
                    numOutputModules: modules.length,
                    outputModule(moduleIndex) {
                        queried.push([queueIndex, moduleIndex]);
                        assert.ok(moduleIndex >= 1 && moduleIndex <= modules.length, "module index out of range");
                        const outputPath = modules[moduleIndex - 1];
                        return { file: outputPath === null ? null : { fsName: outputPath } };
                    }
                };
            }
        }
    };
}

test("collects every output module and attributes its queue/module index", () => {
    // Hard-coding module 1 omits the NFD path and incorrectly leaves SAFE.
    const queried = [];
    const result = collect(projectWithOutputs([
        ["D:/Fixture/normal.mov", "D:/Fixture/cafe\u0301.mov"]
    ], queried));
    assert.deepEqual(queried.map(pair => pair[1]), [1, 2]);
    assert.deepEqual(result.items.filter(item => item.kind === "output"), [
        { path: "D:/Fixture/normal.mov", kind: "output", exists: null, queueIndex: 1, moduleIndex: 1 },
        { path: "D:/Fixture/cafe\u0301.mov", kind: "output", exists: null, queueIndex: 1, moduleIndex: 2 }
    ]);
    assert.equal(result.overall, "WARN");
});

test("zero output modules do not query a nonexistent module", () => {
    const queried = [];
    const result = collect(projectWithOutputs([[]], queried));
    assert.deepEqual(queried, []);
    assert.deepEqual(result.items, [
        { path: "D:/Fixture/project.aep", kind: "project", exists: true }
    ]);
    assert.equal(result.overall, "SAFE");
});

test("two queue items retain every output and restart module indexing", () => {
    const queried = [];
    const result = collect(projectWithOutputs([
        ["D:/Fixture/shared.mov", "D:/Fixture/second.mov"],
        ["D:/Fixture/shared.mov"]
    ], queried));
    assert.deepEqual(queried, [[1, 1], [1, 2], [2, 1]]);
    assert.deepEqual(result.items.filter(item => item.kind === "output"), [
        { path: "D:/Fixture/shared.mov", kind: "output", exists: null, queueIndex: 1, moduleIndex: 1 },
        { path: "D:/Fixture/second.mov", kind: "output", exists: null, queueIndex: 1, moduleIndex: 2 },
        { path: "D:/Fixture/shared.mov", kind: "output", exists: null, queueIndex: 2, moduleIndex: 1 }
    ]);
    assert.equal(result.overall, "SAFE");
});

test("an unassigned output file is explicitly not checked without losing its assigned sibling", () => {
    const queried = [];
    const result = collect(projectWithOutputs([[null, "D:/Fixture/assigned.mov"]], queried));
    assert.deepEqual(queried, [[1, 1], [1, 2]]);
    assert.deepEqual(result.items.filter(item => item.kind === "output"), [
        { path: "", kind: "output", exists: null, queueIndex: 1, moduleIndex: 1 },
        { path: "D:/Fixture/assigned.mov", kind: "output", exists: null, queueIndex: 1, moduleIndex: 2 }
    ]);
    assert.equal(result.overall, "WARN");
    assert.equal(result.coverage, "COMPLETE");
    assert.deepEqual(result.collectionFailures, []);
});

test("an ordinary one-module queue preserves project and output path semantics", () => {
    const queried = [];
    const result = collect(projectWithOutputs([["D:/Fixture/ordinary.mov"]], queried));
    assert.deepEqual(queried, [[1, 1]]);
    assert.deepEqual(result.items, [
        { path: "D:/Fixture/project.aep", kind: "project", exists: true },
        { path: "D:/Fixture/ordinary.mov", kind: "output", exists: null, queueIndex: 1, moduleIndex: 1 }
    ]);
    assert.equal(result.overall, "SAFE");
});

function throwGetter(object, key) {
    Object.defineProperty(object, key, { configurable: true, get() { throw new Error("fixture denied"); } });
}

function fixture() {
    const f = { fsName: "D:/Fixture/footage.png", exists: true };
    const src = Object.assign(new FileSource(), { file: f, missingFootagePath: "" });
    const footage = Object.assign(new FootageItem(), { mainSource: src, footageMissing: false, name: "footage" });
    const outputFiles = [1, 2, 3].map(n => ({ fsName: "D:/Fixture/out" + n + ".mov" }));
    const modules = outputFiles.map(file => ({ file }));
    const queue = { numOutputModules: 3, outputModule: n => modules[n - 1] };
    const rq = { numItems: 1, item: () => queue };
    const projectFile = { fsName: "D:/Fixture/project.aep", exists: true };
    const project = { file: projectFile, numItems: 1, item: () => footage, renderQueue: rq };
    return { project, projectFile, footage, src, f, rq, queue, modules, outputFiles };
}

test("failed inventory read cannot produce SAFE", () => {
    const project = projectWithOutputs([], []);
    throwGetter(project, "numItems");
    const report = scanProject(project);
    assert.equal(report.overall, "WARN", "failed numItems must not look like a successful empty inventory");
    assert.equal(report.coverage, "PARTIAL");
    assert.equal(report.collectionFailures.length, 1);
    assert.equal(report.results[0].path, "D:/Fixture/project.aep");
});

test("total inventory unavailable is UNKNOWN and WARN", () => {
    const project = { file: null };
    throwGetter(project, "numItems");
    throwGetter(project, "renderQueue");
    const report = scanProject(project);
    assert.equal(report.overall, "WARN");
    assert.equal(report.coverage, "UNKNOWN");
    assert.deepEqual(report.results, []);
    assert.equal(report.collectionFailures.length, 2);
});

test("a successful zero inventory remains an observation when the other inventory fails", () => {
    const project = { file: null, numItems: 0 };
    throwGetter(project, "renderQueue");
    const report = scanProject(project);
    assert.equal(report.coverage, "PARTIAL");
    assert.equal(report.overall, "WARN");
});

test("an unavailable project reports UNKNOWN instead of NOTHING CHECKED", () => {
    const report = scanProject(null);
    assert.equal(report.coverage, "UNKNOWN");
    assert.equal(report.overall, "WARN");
    assert.equal(report.collectionFailures[0].operation, "project");
});

test("a complete empty inventory is NONE without failures", () => {
    const report = scanProject({ file: null, numItems: 0, renderQueue: { numItems: 0 } });
    assert.equal(report.overall, "NONE");
    assert.equal(report.coverage, "COMPLETE");
    assert.deepEqual(report.collectionFailures, []);
});

test("non-footage items and non-file sources do not fabricate read failures", () => {
    const project = { file: null, numItems: 2, item: i => i === 1 ? {} :
        Object.assign(new FootageItem(), { mainSource: {} }), renderQueue: { numItems: 0 } };
    const report = scanProject(project);
    assert.equal(report.coverage, "COMPLETE");
    assert.deepEqual(report.collectionFailures, []);
    assert.equal(report.overall, "NONE");
});

test("an existing BLOCKED path wins over incomplete coverage", () => {
    const project = projectWithOutputs([], []);
    project.file.exists = false;
    throwGetter(project, "numItems");
    const report = scanProject(project);
    assert.equal(report.coverage, "PARTIAL");
    assert.equal(report.overall, "BLOCKED");
});

test("multiple failed reads retain both diagnostics and all independently readable paths", () => {
    const f = fixture();
    throwGetter(f.project, "numItems");
    throwGetter(f.outputFiles[1], "fsName");
    const report = scanProject(f.project);
    assert.equal(report.overall, "WARN");
    assert.equal(report.coverage, "PARTIAL");
    assert.deepEqual(report.collectionFailures.map(r => [r.operation, r.itemIndex, r.moduleIndex]), [
        ["project.numItems", null, null], ["output.file.fsName", 1, 2]
    ]);
    assert.deepEqual(report.results.map(r => r.path), [
        "D:/Fixture/project.aep", "D:/Fixture/out1.mov", "", "D:/Fixture/out3.mov"
    ]);
});

test("missing file footage retains its stored path and BLOCKED verdict without a read failure", () => {
    const f = fixture();
    f.src.file = null;
    f.src.missingFootagePath = "D:/Fixture/missing.png";
    f.footage.footageMissing = true;
    const report = scanProject(f.project);
    assert.equal(report.coverage, "COMPLETE");
    assert.deepEqual(report.collectionFailures, []);
    assert.equal(report.overall, "BLOCKED");
    assert.equal(report.results.find(r => r.kind === "footage").path, "D:/Fixture/missing.png");
});

test("invalid counts cannot silently turn into a complete inventory", () => {
    for (const value of [null, undefined, -1, 1.5, NaN, Infinity, "0"]) {
        for (const [target, key, operation] of [
            ["project", "numItems", "project.numItems"],
            ["rq", "numItems", "renderQueue.numItems"],
            ["queue", "numOutputModules", "renderQueue.numOutputModules"]
        ]) {
            const f = fixture();
            f[target][key] = value;
            const report = scanProject(f.project);
            assert.equal(report.overall, "WARN");
            assert.equal(report.coverage, "PARTIAL");
            assert.equal(report.collectionFailures.length, 1);
            assert.equal(report.collectionFailures[0].operation, operation);
        }
    }
});

const failures = [
    ["project.file", null, null, f => throwGetter(f.project, "file")],
    ["project.file.fsName", null, null, f => throwGetter(f.projectFile, "fsName")],
    ["project.file.exists", null, null, f => throwGetter(f.projectFile, "exists")],
    ["project.numItems", null, null, f => throwGetter(f.project, "numItems")],
    ["project.item", 1, null, f => { f.project.item = () => { throw new Error("fixture denied"); }; }],
    ["footage.mainSource", 1, null, f => throwGetter(f.footage, "mainSource")],
    ["footage.file", 1, null, f => throwGetter(f.src, "file")],
    ["footage.file.fsName", 1, null, f => throwGetter(f.f, "fsName")],
    ["footage.file.exists", 1, null, f => throwGetter(f.f, "exists")],
    ["footage.missingFootagePath", 1, null, f => { f.src.file = null; throwGetter(f.src, "missingFootagePath"); }],
    ["footage.footageMissing", 1, null, f => throwGetter(f.footage, "footageMissing")],
    ["footage.name", 1, null, f => throwGetter(f.footage, "name")],
    ["project.renderQueue", null, null, f => throwGetter(f.project, "renderQueue")],
    ["renderQueue.numItems", null, null, f => throwGetter(f.rq, "numItems")],
    ["renderQueue.item", 1, null, f => { f.rq.item = () => { throw new Error("fixture denied"); }; }],
    ["renderQueue.numOutputModules", 1, null, f => throwGetter(f.queue, "numOutputModules")],
    ["renderQueue.outputModule", 1, 2, f => { f.queue.outputModule = n => {
        if (n === 2) throw new Error("fixture denied"); return f.modules[n - 1];
    }; }],
    ["output.file", 1, 2, f => throwGetter(f.modules[1], "file")],
    ["output.file.fsName", 1, 2, f => throwGetter(f.outputFiles[1], "fsName")]
];
for (const [operation, itemIndex, moduleIndex, breakRead] of failures) {
    test("reports a failed " + operation + " read with its location and preserves siblings", () => {
        const f = fixture();
        breakRead(f);
        const report = scanProject(f.project);
        assert.equal(report.coverage, "PARTIAL");
        assert.equal(report.overall, "WARN");
        assert.deepEqual(report.collectionFailures, [{ operation, itemIndex, moduleIndex,
            message: "Could not read " + operation + "." }]);
        if (moduleIndex === 2) {
            assert.ok(report.results.some(r => r.path === "D:/Fixture/out1.mov"));
            assert.ok(report.results.some(r => r.path === "D:/Fixture/out3.mov"));
        }
    });
}

// Executes the real panel callbacks against minimal ScriptUI controls, not AE.
function panel(project, lang) {
    const controls = [];
    class Control {
        constructor(type, text) {
            this.type = type; this.text = text || ""; controls.push(this);
            this.preferredSize = {};
            this.graphics = { font: { name: "test" }, PenType: { SOLID_COLOR: 0 },
                newPen: (_type, rgba) => Array.from(rgba) };
            this.layout = { layout() {}, resize() {} };
        }
        add(type, _bounds, text) { return new Control(type, text); }
        center() {} show() {}
    }
    class Window extends Control { constructor(_type, text) { super("window", text); } }
    class Panel extends Control {}
    const ctx = { app: { project, version: "controlled-test-double", settings: {
        haveSetting: () => true, getSetting: () => lang, saveSetting() {}
    } }, FootageItem, FileSource, Window, Panel,
        ScriptUI: { newFont: name => ({ name }) }, $: { writeln() {} } };
    vm.createContext(ctx);
    vm.runInContext(source.replace(/^#target[^\r\n]*/, ""), ctx);
    controls.find(c => c.type === "button" && c.text === ctx.ucgT(lang, "btn_scan")).onClick();
    return { controls, ctx };
}

for (const lang of ["en", "ja"]) {
    test(lang + " complete panel retains its SAFE headline and green path count", () => {
        const { controls, ctx } = panel(projectWithOutputs([["D:/Fixture/normal.mov"]], []), lang);
        const headline = controls.find(c => c.text === ctx.ucgT(lang, "result", { v: ctx.ucgT(lang, "V_SAFE") }));
        assert.ok(headline);
        assert.deepEqual(headline.graphics.foregroundColor, [0.4, 0.85, 0.5, 1]);
        const safeChip = controls.find(c => c.text === ctx.ucgT(lang, "chip_safe", { n: 2 }));
        assert.deepEqual(safeChip.graphics.foregroundColor, [0.4, 0.85, 0.5, 1]);
    });
    test(lang + " incomplete panel retains a red BLOCKED headline when a path is missing", () => {
        const project = projectWithOutputs([], []);
        project.file.exists = false;
        throwGetter(project, "numItems");
        const { controls, ctx } = panel(project, lang);
        const headline = controls.find(c => c.text === ctx.ucgT(lang, "result", { v: ctx.ucgT(lang, "V_BLOCKED") }));
        assert.ok(headline);
        assert.deepEqual(headline.graphics.foregroundColor, [1, 0.42, 0.42, 1]);
        assert.ok(controls.find(c => c.type === "edittext").text.includes(ctx.ucgT(lang, "incomplete")));
    });
    for (const coverage of ["PARTIAL", "UNKNOWN"]) {
        test(lang + " panel exposes " + coverage + " coverage and never paints SAFE green", () => {
            const project = coverage === "PARTIAL" ? projectWithOutputs([], []) : { file: null };
            throwGetter(project, "numItems");
            if (coverage === "UNKNOWN") throwGetter(project, "renderQueue");
            const { controls, ctx } = panel(project, lang);
            const out = controls.find(c => c.type === "edittext");
            const count = coverage === "PARTIAL" ? 1 : 2;
            assert.ok(out.text.includes(ctx.ucgT(lang, "coverage", {
                coverage: ctx.ucgT(lang, "C_" + coverage), n: count
            })));
            assert.ok(out.text.includes(ctx.ucgT(lang, "incomplete")));
            const headline = controls.find(c => c.text === ctx.ucgT(lang, "result", { v: ctx.ucgT(lang, "V_WARN") }));
            assert.ok(headline, "incomplete scan must have a WARN headline");
            assert.deepEqual(headline.graphics.foregroundColor, [1, 0.78, 0.3, 1]);
            const safeChip = controls.find(c => c.text === ctx.ucgT(lang, "chip_safe", { n: coverage === "PARTIAL" ? 1 : 0 }));
            assert.ok(safeChip);
            assert.deepEqual(safeChip.graphics.foregroundColor, [0.85, 0.85, 0.85, 1]);
            if (coverage === "PARTIAL") {
                controls.find(c => c.type === "button" && c.text === ctx.ucgT(lang, "btn_lang")).onClick();
                const other = lang === "en" ? "ja" : "en";
                assert.ok(out.text.includes(ctx.ucgT(other, "incomplete")), "language toggle retains coverage warning");
            }
        });
    }
}
