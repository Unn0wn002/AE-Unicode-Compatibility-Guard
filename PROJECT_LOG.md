# AE Unicode Compatibility Guard — project log

Evidence classes: VERIFIED_THIS_SESSION, HISTORICAL_RECORDED, USER_STATED, UNVERIFIED, NOT_RUN, BLOCKED. Last updated: 2026-11-01. Not a release record; private GitHub repo Unn0wn002/AE-Unicode-Compatibility-Guard (pushed 2026-11-01).

## Identity
Research idea **23-A** (rank 5, sheet score 83, difficulty 3, feasibility "PLAUSIBLE"). Read-only After Effects script that scans the project path, footage paths and render output paths for Japanese/non-ASCII path risks and returns SAFE / WARN / BLOCKED. Scope: `docs/PROJECT_SPECIFICATION.md`. Folder: `02_Projects\AE-Unicode-Compatibility-Guard`. Branch `main`, 1 local commit (`945d96d`).
Distinct from AE Glyph (9-A): that checks fonts/glyphs in text layers; this checks file paths. The sheet gives 23-A no parent dependency.

## Where the records are
`PROJECT_STATUS.md`, `TEST_MATRIX.md`, `KNOWN_LIMITATIONS.md`, `CHANGELOG.md`, `evidence/native-20261101-u01-u07/`, shared `HANDOFF_LOG_2026-10-29.md`. Fixtures are generated into `_qa_scratch/` (ignored) by `scripts/make_fixtures.py`.

## Timeline (all 2026-11-01, VERIFIED_THIS_SESSION)
- Scope drafted and approved by the owner (accepting SMB and macOS as untested); repo created with all files inside the project folder (new owner rule).
- v0 probe + 18 unit tests + static checks written.
- Native U01–U07 on AE 2026 (one machine): expected verdicts — decomposed (NFD) name WARN, 246-character path WARN, deleted file with a Japanese path BLOCKED (AE also warned of a missing file), Japanese local/project paths and the OneDrive Japanese-named file SAFE. U08 SMB NOT_RUN, U09 macOS BLOCKED, U10 (260+ character path) NOT_RUN. OneDrive test folder recycled afterwards.

## Update 2026-11-01 (later): panel v0.2
Owner said to convert it and allowed a restart. The Guard became a ScriptUI panel with an itemized result (every path with kind, location class, reasons; UG1 closed). Verified natively floating on the fixture project, then installed through After Effects' menu (per-user preferences folder), After Effects restarted, opened from the Window menu and docked; the docked scan gives the same result. Installed file is a copy (re-install after code changes). Evidence: `evidence/native-20261101-panel-v02/`.

## Current state
18/18 unit tests, static checks pass; native results above; the v0.2 panel lists every path with kind and location class.

## Open items and caveats
- **Research caveat (Drive packet CYCLE-20261101-1100WIB__AE, HISTORICAL_RECORDED, not re-verified):** 23-A is marked HOLD. Adobe AE 26.0 fixed Japanese characters in render-queue export filenames, so those are vendor-fixed cases; remaining pain is narrow, version-dependent, LOW commercial confidence. The SMB/non-ASCII failure from the sheet was not reproduced here.
- **UI standard:** met in v0.2 (panel, docked once).
- NFD detection is a heuristic; Windows file systems mostly ignore the NFC/NFD difference.
- Long scans produce a long scrollable list; no export to file.

## Next step
Owner decides: keep as a bounded v0.2 for the course, or drop 23-A in favour of a stronger idea (see HOLD note).

- 2026-11-01 quality review across all six plugins: see `02_Projects\_docs\QUALITY_REVIEW_20261101.md`.
- 2026-11-01 (later): Japanese-first UI (v0.3) added on the owner's request; re-installed twice and After Effects restarted twice (allowed); docked scan in Japanese gives the same result as English; intro cut-off fixed. Evidence: `evidence/native-20261101-japanese-ui/`. Japanese wording not native-reviewed.
- 2026-11-01 (later): owner said "push them and set it Private". Created PRIVATE GitHub repo https://github.com/Unn0wn002/AE-Unicode-Compatibility-Guard and pushed `main` (554ee1e); first CI run `validation` succeeded. Not released, not public.
- 2026-11-01 (later): readability pass on the owner's request ("All six"): coloured result line/badge; native check recorded in `evidence/native-20261101-readability/`. Pushed to the private repo.

- 2026-11-02 (owner: "start the Sentinel and Guard"): branch `ui/result-lines-20261102` (local commit, NOT pushed): coloured BLOCKED/WARN/SAFE count lines and a shortened first-problem line (display only). 27 tests, static checks ok. Native floating run from src on the fixture project: PASS_BOUNDED_NATIVE (Japanese and English); evidence `evidence/native-20261102-result-lines/`. Not installed, docked NOT_RUN. Fixture project was left open in After Effects; Guard language restored to Japanese.

- 2026-11-02 (owner: "merge them" and allowed install): PR #1 (result lines) merged (8ab3aeb). Installed the panel to the per-user ScriptUI Panels folder, restarted AE twice; docked check found the counts and first-problem lines clipped at about 230 px; fixed on local branch `ui/dock-wrap-20261102` (multiline, wrap); re-installed and re-checked docked: PASS_BOUNDED_NATIVE. Evidence `evidence/native-20261102-docked-lines/`. Branch NOT pushed.

- 2026-11-02 (audit after the AE Glyph false-green finding): `ucgOverall([])` returned "SAFE", so a scan that found no paths showed a green RESULT: SAFE. Changed to "NONE" (amber, "NOTHING CHECKED" / 「検査対象なし」); the old unit test that asserted SAFE for an empty scan was changed on purpose. 27 tests pass; static checks ok. Native check NOT_RUN (needs the panel reinstalled and After Effects restarted). Branch `fix/empty-scan-20261102`, NOT pushed.

- 2026-11-06 — Status files reconciled (owner-approved "status-file cleanup"): `PROJECT_STATUS.md` gained a dated authoritative current section above the unchanged earlier entries; `TEST_MATRIX.md` got a historical banner only; `README.md` status sentence now says v0.3 on main `b3f3e33`. Sources: git (read-only), `CHANGELOG.md`, `evidence/`, `_docs/AUDIT_20261104/README.md`. No evidence, source, tests, scripts or CHANGELOG were changed; nothing was committed; no tests were re-run.


## 2026-11-06 - UG-01: enumerate every render-queue output module

- Local uncommitted candidate on main b3f3e337: collectItems now reads each queue item numOutputModules, visits modules 1 through count, and retains queueIndex/moduleIndex on output items. Array return and read-only path semantics preserved.
- CONTROLLED_NODE_TEST_DOUBLES_NOT_NATIVE: node --test tests/*.test.js RED 27/28 (expected missing module 2), GREEN 32/32, zero skips; python -I -X utf8 tests/static_checks.py PASS. All command exits and source hashes are in the run report. Five new collector tests cover multiple outputs, zero modules, two queues, unassigned file and ordinary one-module behavior.
- Report: D:/Work/Projects/_docs/PLAN_20261106/AE-Unicode-Compatibility-Guard/runs/UG-01_20261106-2040.md. Existing status reconciliation and local-only rules/routers preserved; protected PROJECT_STATUS.md was not edited by this task.
- Open: UG-02 failed-read/incomplete-coverage defect remains; UG-01 After Effects/install/docked validation NOT_RUN. Source differs from unchanged dist; no copy, install, host run, commit, push, merge or release. Next task from START_INDEX.md: UG-02 (now dependency-unblocked; not started here).


## 2026-11-06 - UG-02: incomplete collection cannot report SAFE

- Local uncommitted candidate on main b3f3e337: collectItems now returns items, collectionFailures and COMPLETE/PARTIAL/UNKNOWN coverage. Failed reads retain English operation/index diagnostics and successfully collected siblings. scan includes coverage/failures in console JSON and passes completeness to ucgOverall; incomplete scans WARN unless a path is BLOCKED. UG-01 multi-output enumeration remains covered.
- Complete empty scans remain NONE; normal non-file sources remain intentional skips. Null unassigned outputs become explicit empty-path, not-checked WARN items without synthetic read failures. EN/JA coverage and failed-read text is generated from messages.json; incomplete SAFE chips stay neutral.
- CONTROLLED_NODE_TEST_DOUBLES_NOT_NATIVE: corrected RED 31/65 (34 expected assertion failures), GREEN 72/72, zero skips; static checks PASS (exit 0). First RED also revealed an invalid ScriptUI double; its missing preferredSize was corrected, exact baseline source restored for a fresh RED, and the candidate restored afterwards. See report for exact commands, limitations, diff and hashes.
- Report: D:/Work/Projects/_docs/PLAN_20261106/AE-Unicode-Compatibility-Guard/runs/UG-02_20261106-2046.md. Historical evidence, prior edits and local-only rules/routers preserved. Protected PROJECT_STATUS.md remains unchanged by this task; current task state is recorded here and in the report.
- NOT_RUN: actual AE getters/errors, installation/restart, native docked layout and Japanese acceptance; dist unchanged. No commit, staging, push, merge, release or host action. UG-03 still needs XP-02 and explicit host-session approval. Next START_INDEX task is XP-01; Audio execution requires a non-Codex executor under current rules.
- 2026-11-07 (Guard dist check, executor Claude Code; no commit/push/install): `dist/Unicode_Compatibility_Guard.jsx` (sha256 `e3ea3be59acfe7e5873d98a2ed09954be6a78d2f3b09048d793609eef2d01b8e`) is a byte copy (CRLF) of `src/UCG_Probe.jsx` at `b3f3e33`; it is the pre-repair build and does not contain the UG-01/UG-02 repair. Built a repaired copy from a clean detached worktree at `556df4681fa3ee6fedbc92ef7ef331d049503eb9` (`_qa_scratch/rebuild-20261107/`): `scripts/gen_i18n.py` leaves the source unchanged, `node --test tests/*.test.js` 72/72, `tests/static_checks.py` ok (test doubles, not AE evidence); rebuilt `dist` sha256 `fc048dfed220d28890212ea54c4a21ba664c5e8dfb601405743670a0034a95f1` equals the repaired source (472 lines vs 419). The main checkout `dist/` and the installed AE panel were NOT changed. Native validation of the repair (UG-03) is still NOT_RUN.
- 2026-11-07 (UG-03, host run by Claude Code via computer use with Aria's approval; executor Claude Code): overwrote the installed per-user `Unicode_Compatibility_Guard.jsx` (old `e3ea3be5...`, backup `_qa_scratch/ug03/installed-before-e3ea3be5.jsx`) with the repaired build `fc048dfed220d28890212ea54c4a21ba664c5e8dfb601405743670a0034a95f1` (hash verified before and after the run) and launched After Effects 2026 (26.5). PASS_BOUNDED_NATIVE: panel docked; empty project = amber NOTHING CHECKED; two-output-module fixture (new `scripts/UCG_BuildOutputModuleFixture.jsx`) lists BOTH output paths (WARN for the decomposed-name one, SAFE 2, coverage Complete); all-ASCII project = green SAFE with Complete coverage; EN/JA toggle without rescan; narrow dock readable. NOT_RUN natively: throwing-getter/incomplete-collection path (test doubles only), dock persistence across restart, incomplete-coverage warning. No defect. Screenshots were viewed but not saved; observations are recorded in `evidence/native-20261107-ug03-collection/README.md`. The repaired build is installed on this machine; the committed repo `dist/` is still the old build. Nothing committed or pushed. Report: `D:/Work/Projects/_docs/PLAN_20261106/AE-Unicode-Compatibility-Guard/runs/UG-03_20261107-1715.md`.
- 2026-11-07 (Guard dist updated, Aria's yes): copied the repaired build over the local git-ignored `dist/Unicode_Compatibility_Guard.jsx`; it now equals `src/UCG_Probe.jsx` and the installed panel (sha256 `fc048dfed220d28890212ea54c4a21ba664c5e8dfb601405743670a0034a95f1`). Old dist (`e3ea3be5...1b8e`) backed up at `_qa_scratch/ug03/dist-before-e3ea3be5.jsx`. `dist/` is git-ignored, so nothing to commit for it; distribution still NOT APPROVED.
