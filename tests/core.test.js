"use strict";
// Tests the pure core of src/UCG_Probe.jsx with test doubles. These are NOT host evidence.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const src = fs.readFileSync(path.join(__dirname, "..", "src", "UCG_Probe.jsx"), "utf8");
const m = src.match(/\/\/ <UCG_CORE>([\s\S]*?)\/\/ <\/UCG_CORE>/);
assert.ok(m, "core markers missing");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(m[1], ctx);

const ev = (p, o) => ctx.ucgEvaluatePath(Object.assign({ path: p, kind: "footage", exists: true }, o));

test("analyzeChars: ASCII", () => {
  const a = ctx.ucgAnalyzeChars("C:\\proj\\plain.png");
  assert.strictEqual(a.nonAscii, false);
});
test("analyzeChars: hiragana, katakana, kanji counts", () => {
  const a = ctx.ucgAnalyzeChars("日本語フォルダ\\てすと.png");
  assert.strictEqual(a.nonAscii, true);
  assert.strictEqual(a.kanji, 3);
  assert.strictEqual(a.katakana, 4);
  assert.strictEqual(a.hiragana, 3);
  assert.strictEqual(a.combining.length, 0);
});
test("analyzeChars: decomposed dakuten is reported as combining", () => {
  const a = ctx.ucgAnalyzeChars("か\u3099めん.png");
  assert.strictEqual(a.combining.length, 1);
  assert.ok(a.combining[0].indexOf("U+3099") === 0);
});
test("analyzeChars: latin combining accent and surrogate pair", () => {
  assert.strictEqual(ctx.ucgAnalyzeChars("e\u0301.png").combining.length, 1);
  assert.strictEqual(ctx.ucgAnalyzeChars("\uD842\uDFB7.png").supplementary, 2);
});
test("analyzeChars: half-width katakana is its own class", () => {
  assert.strictEqual(ctx.ucgAnalyzeChars("ｶﾞ.png").halfwidthKatakana, 2);
});

test("evaluate: ASCII local existing file is SAFE", () => {
  assert.strictEqual(ev("C:\\proj\\plain.png").verdict, "SAFE");
});
test("evaluate: Japanese NFC local existing file is SAFE with a note", () => {
  const r = ev("C:\\proj\\日本語\\テスト.png");
  assert.strictEqual(r.verdict, "SAFE");
  assert.ok(r.notes.length >= 1);
});
test("evaluate: NFD name warns", () => {
  assert.strictEqual(ev("C:\\proj\\か\u3099めん.png").verdict, "WARN");
});
test("evaluate: missing file is BLOCKED, with a non-ASCII hint", () => {
  const r = ev("C:\\proj\\消える.png", { exists: false });
  assert.strictEqual(r.verdict, "BLOCKED");
  assert.ok(/non-ASCII/.test(r.reasons[0]));
});
test("evaluate: exists null (unknown) does not block", () => {
  assert.strictEqual(ev("C:\\proj\\a.png", { exists: null }).verdict, "SAFE");
});
test("evaluate: path length thresholds", () => {
  const base = "C:\\" + "a".repeat(236) + ".png"; // 3 + 236 + 4 = 243
  assert.strictEqual(ev(base).verdict, "WARN");
  const longer = "C:\\" + "a".repeat(260) + ".png";
  assert.strictEqual(ev(longer).verdict, "BLOCKED");
  const ok = "C:\\" + "a".repeat(200) + ".png";
  assert.strictEqual(ev(ok).verdict, "SAFE");
});
test("evaluate: non-ASCII on a UNC path warns; ASCII on UNC does not", () => {
  assert.strictEqual(ev("\\\\nas\\share\\日本語\\a.png").verdict, "WARN");
  assert.strictEqual(ev("\\\\nas\\share\\ascii\\a.png").verdict, "SAFE");
});
test("evaluate: non-ASCII on /Volumes warns", () => {
  assert.strictEqual(ev("/Volumes/Work/日本語/a.png").verdict, "WARN");
});
test("evaluate: cloud-synced non-ASCII is SAFE but noted", () => {
  const r = ev("C:\\Users\\x\\OneDrive\\日本語\\a.png");
  assert.strictEqual(r.verdict, "SAFE");
  assert.strictEqual(r.location, "CLOUD_SYNCED");
  assert.ok(r.notes.join(" ").indexOf("Cloud-synced") !== -1);
});
test("evaluate: empty path warns", () => {
  assert.strictEqual(ev("").verdict, "WARN");
});

test("overall and counts", () => {
  const rs = [ev("C:\\a.png"), ev("C:\\か\u3099.png"), ev("C:\\gone.png", { exists: false })];
  assert.strictEqual(ctx.ucgOverall(rs), "BLOCKED");
  assert.strictEqual(ctx.ucgCount(rs, "SAFE"), 1);
  assert.strictEqual(ctx.ucgCount(rs, "WARN"), 1);
  assert.strictEqual(ctx.ucgCount(rs, "BLOCKED"), 1);
  // An empty scan is not an all-clear: nothing was checked.
  assert.strictEqual(ctx.ucgOverall([]), "NONE");
});

test("classifyLocation", () => {
  assert.strictEqual(ctx.ucgClassifyLocation("\\\\nas\\s").kind, "NETWORK");
  assert.strictEqual(ctx.ucgClassifyLocation("D:\\a").kind, "LOCAL_OR_MAPPED");
  assert.strictEqual(ctx.ucgClassifyLocation("").kind, "UNKNOWN");
});

test("toJson round-trips a report containing Japanese and combining marks", () => {
  const r = ev("C:\\proj\\か\u3099めん\\日本語.png");
  assert.deepStrictEqual(JSON.parse(ctx.ucgToJson(r)), JSON.parse(JSON.stringify(r)));
});

test("tone: verdicts map to colour tones", () => {
  assert.strictEqual(ctx.ucgTone("SAFE"), "OK");
  assert.strictEqual(ctx.ucgTone("WARN"), "WARN");
  assert.strictEqual(ctx.ucgTone("BLOCKED"), "BAD");
  assert.strictEqual(ctx.ucgTone("NONE"), "WARN", "an empty scan is amber, never green");
  assert.strictEqual(ctx.ucgTone("other"), "INFO");
  for (const k of ["OK", "WARN", "BAD", "INFO"]) assert.strictEqual(ctx.UCG_TONE_RGB[k].length, 3);
});

test("ucgChipTone keeps zero counts grey", () => {
  assert.strictEqual(ctx.ucgChipTone("BLOCKED", 0), "INFO");
  assert.strictEqual(ctx.ucgChipTone("BLOCKED", 2), "BAD");
  assert.strictEqual(ctx.ucgChipTone("WARN", 1), "WARN");
  assert.strictEqual(ctx.ucgChipTone("SAFE", 5), "OK");
  assert.strictEqual(ctx.ucgChipTone("SAFE", 0), "INFO");
});

test("incomplete collection is WARN unless a collected path is BLOCKED", () => {
  assert.strictEqual(ctx.ucgOverall([], false), "WARN");
  assert.strictEqual(ctx.ucgOverall([ev("C:/plain.png")], false), "WARN");
  assert.strictEqual(ctx.ucgOverall([ev("C:/gone.png", { exists: false })], false), "BLOCKED");
  assert.strictEqual(ctx.ucgOverall([], true), "NONE");
  assert.strictEqual(ctx.ucgOverall([ev("C:/plain.png")], true), "SAFE");
  assert.strictEqual(ctx.ucgOverall([ev("C:/plain.png")]), "SAFE");
});

test("SAFE count chips stay neutral when collection is incomplete", () => {
  assert.strictEqual(ctx.ucgChipTone("SAFE", 1, false), "INFO");
  assert.strictEqual(ctx.ucgChipTone("SAFE", 1, true), "OK");
  assert.strictEqual(ctx.ucgChipTone("BLOCKED", 1, false), "BAD");
  assert.strictEqual(ctx.ucgChipTone("WARN", 1, false), "WARN");
});

test("ucgShortPath keeps start and end within the limit", () => {
  assert.strictEqual(ctx.ucgShortPath("C:/a.aep", 44), "C:/a.aep");
  assert.strictEqual(ctx.ucgShortPath(null, 10), "");
  const long = "C:/Users/x/Projects/" + "d".repeat(80) + "/file.aep";
  const s = ctx.ucgShortPath(long, 44);
  assert.strictEqual(s.length, 44);
  assert.ok(s.startsWith("C:/Users") && s.endsWith("file.aep") && s.includes("..."));
});

test("ucgFirstProblem prefers BLOCKED over WARN and is null when all SAFE", () => {
  const r = (verdict, path) => ({ verdict, path });
  assert.strictEqual(ctx.ucgFirstProblem([r("SAFE", "a"), r("WARN", "b"), r("BLOCKED", "c")]).path, "c");
  assert.strictEqual(ctx.ucgFirstProblem([r("SAFE", "a"), r("WARN", "b")]).path, "b");
  assert.strictEqual(ctx.ucgFirstProblem([r("SAFE", "a")]), null);
  assert.strictEqual(ctx.ucgFirstProblem([]), null);
});
