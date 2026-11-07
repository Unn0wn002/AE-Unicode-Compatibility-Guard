"use strict";
// Translation coverage for the panel UI (test doubles; not host evidence).
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const src = fs.readFileSync(path.join(__dirname, "..", "src", "UCG_Probe.jsx"), "utf8");
const m = src.match(/\/\/ <UCG_CORE>([\s\S]*?)\/\/ <\/UCG_CORE>/);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(m[1], ctx);
const messages = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "i18n", "messages.json"), "utf8"));
const plain = (o) => JSON.parse(JSON.stringify(o)); // objects from the vm context have another prototype

test("generated table in the script matches i18n/messages.json", () => {
  assert.deepStrictEqual(plain(ctx.UCG_TEXT.ja), messages.ja);
  assert.deepStrictEqual(plain(ctx.UCG_TEXT.en), messages.en);
});

test("ja and en have the same keys", () => {
  assert.deepStrictEqual(Object.keys(messages.ja).sort(), Object.keys(messages.en).sort());
});

test("every key used by the script exists in both languages", () => {
  const used = new Set();
  for (const x of src.matchAll(/"([GN]_[A-Z_]+)"/g)) used.add(x[1]);
  for (const x of src.matchAll(/\bT\("([a-z_]+)"/g)) used.add(x[1]);
  for (const v of ["SAFE", "WARN", "BLOCKED"]) used.add("V_" + v);
  for (const k of ["project", "footage", "output"]) used.add("KIND_" + k);
  for (const k of ["NETWORK", "CLOUD_SYNCED", "VOLUME", "LOCAL_OR_MAPPED", "UNKNOWN"]) used.add("K_" + k);
  const missing = [...used].filter((k) => !(k in messages.ja) || !(k in messages.en));
  assert.deepStrictEqual(missing, []);
  assert.ok(used.size > 25);
});

test("every code the core returns has text, and placeholders are all filled", () => {
  const ev = (p, o) => ctx.ucgEvaluatePath(Object.assign({ path: p, kind: "footage", exists: true }, o));
  const cases = [
    ev(""),
    ev("C:/proj/消える.png", { exists: false }),
    ev("C:/" + "a".repeat(260) + ".png"),
    ev("C:/" + "a".repeat(240) + ".png"),
    ev("C:/proj/か\u3099めん.png"),
    ev("//nas/share/日本語/a.png"),
    ev("/Volumes/Work/日本語/a.png"),
    ev("C:/proj/ｶﾞ.png"),
    ev("C:/proj/\uD842\uDFB7.png"),
    ev("C:/proj/日本語/テスト.png"),
    ev("C:/Users/x/OneDrive/a.png")
  ];
  let count = 0;
  for (const r of cases) {
    for (const c of r.codes.concat(r.noteCodes)) {
      count += 1;
      for (const lang of ["ja", "en"]) {
        assert.ok(c.k in messages[lang], "missing " + lang + " text for " + c.k);
        const s = ctx.ucgT(lang, c.k, c.p);
        assert.ok(!/\{[a-z]+\}/.test(s), "unfilled placeholder in " + lang + " " + c.k + ": " + s);
      }
    }
  }
  assert.ok(count >= 12);
});

test("ucgT falls back to English, then to the key; ja differs from en", () => {
  assert.strictEqual(ctx.ucgT("fr", "btn_scan"), "Scan project");
  assert.strictEqual(ctx.ucgT("ja", "no_such_key"), "no_such_key");
  assert.notStrictEqual(ctx.ucgT("ja", "btn_scan"), ctx.ucgT("en", "btn_scan"));
  assert.strictEqual(ctx.ucgT("en", "G_LEN_WARN", { n: 246 }), "Path is 246 characters (close to the classic 260 Windows limit).");
});

test("coverage states and incomplete-read messages translate without unfilled placeholders", () => {
  for (const lang of ["en", "ja"]) {
    for (const state of ["COMPLETE", "PARTIAL", "UNKNOWN"]) {
      const label = ctx.ucgT(lang, "C_" + state);
      assert.notStrictEqual(label, "C_" + state);
      const line = ctx.ucgT(lang, "coverage", { coverage: label, n: 2 });
      assert.ok(line.includes(label) && line.includes("2"));
      assert.ok(!/\{[a-z]+\}/.test(line));
    }
    assert.notStrictEqual(ctx.ucgT(lang, "incomplete"), "incomplete");
  }
});
