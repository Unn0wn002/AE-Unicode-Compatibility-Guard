> **Historical status document (last updated 2026-11-01).** For current status see [PROJECT_STATUS.md](PROJECT_STATUS.md). Content below is kept unchanged for history; known outdated: the 18/18 test count (27/27 at the 2026-11-04 audit) and no 2026-11-02 result-line, dock-wrap or empty-scan rows.

# Test matrix

Evidence classes: VERIFIED_THIS_SESSION, HISTORICAL_RECORDED, UNVERIFIED, NOT_RUN, BLOCKED. Native results are never claimed from mock tests or CI.

## Automated (test doubles, not host evidence) — 18/18 pass 2026-11-01
Character classes, combining marks, surrogates, half-width katakana, NFC/NFD, missing file, unknown existence, path-length thresholds, UNC and /Volumes rules, cloud-synced note, empty path, overall/count, JSON round-trip. Static checks: read-only tokens, host-independent core, ES3 syntax.

## Native After Effects 2026 (disposable project only, one machine)
| ID | Case | Expected | Observed | Status |
|---|---|---|---|---|
| U01 | ASCII local file | SAFE | counted among SAFE (not itemised) | PASS_BOUNDED_NATIVE |
| U02 | Japanese NFC local file | SAFE | counted among SAFE | PASS_BOUNDED_NATIVE |
| U03 | Decomposed (NFD) name | WARN | WARN "combining characters (1) … decomposed" | PASS_BOUNDED_NATIVE |
| U04 | 246-character path | WARN | WARN "Path is 246 characters" | PASS_BOUNDED_NATIVE |
| U05 | Missing file, Japanese path | BLOCKED | BLOCKED "File was not found at the stored path…" (AE also warned "1 file is missing") | PASS_BOUNDED_NATIVE |
| U06 | Japanese project file path | SAFE | counted among SAFE (6 paths: 4 SAFE before deletion) | PASS_BOUNDED_NATIVE |
| U07 | OneDrive Japanese-named file | SAFE (noted cloud-synced) | SAFE count rose 3 → 4; location class not shown in dialog | PASS_BOUNDED_NATIVE (location note unverified in UI) |
| U08 | SMB / network share + non-ASCII | WARN | — | NOT_RUN (no share known) |
| U09 | macOS paths | — | — | BLOCKED (no Mac) |
| U11 | v0.2 ScriptUI panel (floating) on the fixture project: itemized scan incl. SAFE items and location classes | PASS_BOUNDED_NATIVE 2026-11-01 (evidence/native-20261101-panel-v02) |
| U12 | Installed via File > Scripts > Install ScriptUI Panel, restart, Window menu entry, docked | PASS_BOUNDED_NATIVE 2026-11-01 |
| U13 | Docked panel gives the same scan result as floating | PASS_BOUNDED_NATIVE 2026-11-01 |
| U14 | Japanese-first UI with English toggle, docked; same scan result (v0.3) | PASS_BOUNDED_NATIVE 2026-11-01 (evidence/native-20261101-japanese-ui) |
| U15 | Bold coloured result + counts line (red BLOCKED path) | PASS_BOUNDED_NATIVE 2026-11-01 (evidence/native-20261101-readability); green/amber unit-tested only |
| U10 | Path ≥260 characters in a real project | BLOCKED | could not import such a file | NOT_RUN (unit-tested only) |
