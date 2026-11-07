# Project status — AE Unicode Compatibility Guard

## Current status — 2026-11-06 (authoritative)

Reconciled 2026-11-06 from git (read-only), `CHANGELOG.md`, `PROJECT_LOG.md`, `evidence/` and the 2026-11-04 audit `D:/Work/Projects/_docs/AUDIT_20261104/README.md`. Newest dated evidence wins; nothing below was re-run today.

**Version / candidate**
- v0.3 ScriptUI panel (Japanese-first, English toggle) on `main` at `b3f3e33` (merge of PR #3); local `main` equals `origin/main` (`git rev-parse main origin/main`, 2026-11-06). Version string: `src/UCG_Probe.jsx` lines 4 and 260.
- PRs #1–#3 (result lines, dock wrap, empty scan) are merged into `main` (`git log`). Evidence branch `docs/evidence-empty-scan-20261102` (`7135157`) is pushed; PR #4 was open at the 2026-11-04 audit (`_docs/AUDIT_20261104/AE-Unicode-Compatibility-Guard-github.json`); its state today is UNVERIFIED.
- Installed panel matched source bytes at the 2026-11-04 audit (`_docs/AUDIT_20261104/README.md`, "Current project stages"). The only distributable is `dist/Unicode_Compatibility_Guard.jsx`; there is no package verifier.

**Release state & approvals**
- Not released; distribution NOT APPROVED; GitHub repo private (`AGENTS.md`, "Release gate"). Release, making public, push, merge and reinstall each need Aria's explicit approval.

**Completed gates (HISTORICAL_RECORDED native runs, one Windows machine, AE 2026)**
- U01–U07 expected verdicts: PASS_BOUNDED_NATIVE — `evidence/native-20261101-u01-u07/`.
- U11–U13 panel floating / installed / docked: PASS_BOUNDED_NATIVE — `evidence/native-20261101-panel-v02/`.
- U14 Japanese-first UI docked: PASS_BOUNDED_NATIVE — `evidence/native-20261101-japanese-ui/`.
- U15 coloured result line: PASS_BOUNDED_NATIVE (red only; green/amber unit-tested) — `evidence/native-20261101-readability/`.
- Result lines (floating): PASS_BOUNDED_NATIVE — `evidence/native-20261102-result-lines/`; dock wrap (docked): PASS_BOUNDED_NATIVE — `evidence/native-20261102-docked-lines/`.
- Empty scan = NOTHING CHECKED (docked, installed): PASS_BOUNDED_NATIVE recorded only on unmerged branch `docs/evidence-empty-scan-20261102` (`evidence/native-20261102-empty-scan/` in commit `7135157`); not yet on `main`, so `main` itself still records it as NOT_RUN (`CHANGELOG.md`, 2026-11-02).

**Remaining gates**
- U08 SMB / network share + non-ASCII: NOT_RUN. U10 real ≥260-character import: NOT_RUN (unit-tested only). U09 macOS: BLOCKED (no Mac). Source: `TEST_MATRIX.md`.
- The core claim (network path + non-ASCII = risk) is unproven here (`KNOWN_LIMITATIONS.md`; audit README).
- All-SAFE (green) project natively: NOT_RUN (`evidence/native-20261102-empty-scan/README.md` on branch `7135157`).

**Open defects (2026-11-04 audit, CONTROLLED_NODE_TEST_DOUBLES_NOT_NATIVE, not reproduced in AE). 2026-11-07: both fixed in local branch commit `ebbe50f`; the second-output-module fix is PASS_BOUNDED_NATIVE in AE (`evidence/native-20261107-ug03-collection/README.md`, repaired build `fc048dfe...95f1` installed per user); the failed-read path is unit-tested only, NOT_RUN natively.**
- P2: `collectItems()` reads only `outputModule(1)` — `src/UCG_Probe.jsx:246`; a second output module's path is never checked (`_docs/AUDIT_20261104/ucg-coverage-probe.json`).
- P2: a failed inventory read (e.g. throwing `project.numItems`, `src/UCG_Probe.jsx:226`) is hidden behind SAFE with no collection-failure report (same probe file).
- UG2 (no relink/plug-in/locale checks) remains out of scope by design (history below).

**Latest automated test result**
- From the 2026-11-04 audit run (not re-run today): `node --test tests/*.test.js` 27/27 pass and `tests/static_checks.py` pass — `_docs/AUDIT_20261104/AE-Unicode-Compatibility-Guard/results.jsonl`, `check-1.log`, `check-2.log`. Exact-head CI `validation` on `b3f3e33` succeeded (`_docs/AUDIT_20261104/AE-Unicode-Compatibility-Guard-github.json`). These are test doubles, not AE evidence.

**Where evidence lives**
- Native runs: `evidence/native-YYYYMMDD-*/`. Audit: `D:/Work/Projects/_docs/AUDIT_20261104/` (README, `AE-Unicode-Compatibility-Guard/`, `ucg-coverage-probe.*`). Release notes: `CHANGELOG.md`. Running history: `PROJECT_LOG.md`.

**Status documents**
- `PROJECT_STATUS.md` (this section): current and authoritative. The entries below it are HISTORICAL (2026-11-01; say 18/18 tests and omit 2026-11-02 work).
- `TEST_MATRIX.md`: HISTORICAL (2026-11-01, 18/18; no 2026-11-02 rows) — bannered; its native rows remain valid history.
- `KNOWN_LIMITATIONS.md`: still current (no outdated status claims); the two P2 defects above are not listed there.
- `CHANGELOG.md`: current for release notes (to 2026-11-02). `README.md`: status sentence updated 2026-11-06. `PROJECT_LOG.md`: running history (its 2026-11-02 "NOT pushed" notes are superseded by the merges above).

**Next recommended step**
- Repair both P2 collection defects in `src/UCG_Probe.jsx` with multi-output and collection-failure tests, then (with Aria's approval) merge or close evidence PR #4 so the empty-scan native record reaches `main`.

## Earlier status entries (historical — superseded by the section above, kept unchanged)

Last updated: 2026-11-01. Source idea: 23-A in `anime_jp_tool_ideas.xlsx` (research-stage scores, not tested). Scope: `docs/PROJECT_SPECIFICATION.md`.

## State
- **v0.3 (2026-11-01): Japanese-first UI with an English toggle** (text in `i18n/messages.json`, generated into the script as escapes; script stays ASCII). Verified natively docked: `evidence/native-20261101-japanese-ui/`. 23 tests incl. translation coverage.
- **v0.2 (2026-11-01): the UI is a ScriptUI panel** (floating via Run Script File, or a docked panel once installed). Verified natively floating, installed and docked: `evidence/native-20261101-panel-v02/`. Scan output now lists every path with kind and location class (finding UG1 closed).
- v0 probe: `src/UCG_Probe.jsx` (project path + footage paths + render output paths; non-ASCII class, NFD/combining heuristic, location class, round-trip/missing check, Windows path length; SAFE/WARN/BLOCKED).
- Unit tests 18/18 and static checks pass (test doubles, 2026-11-01). Not host evidence.
- Native After Effects 2026 (2026-11-01, one machine): U01–U07 PASS_BOUNDED_NATIVE for expected verdicts. U08 (SMB) NOT_RUN, U09 (macOS) BLOCKED. Evidence: `evidence/native-20261101-u01-u07/`.
- Not released. Distribution NOT APPROVED. GitHub: private repo Unn0wn002/AE-Unicode-Compatibility-Guard (pushed 2026-11-01; CI green).

## Narrowed from the scope
- No file export (dialog + console JSON only).
- Network/SMB and macOS behaviour untested; the SMB/non-ASCII rule is from the research sheet, not reproduced here.
- Paths ≥260 characters could not be imported into After Effects here, so BLOCKED-by-length is unit-tested only.

## Open findings
- UG1 (SAFE items and location classes not shown) is CLOSED in v0.2.
- UG2: no check for relink-triggering behaviour or plug-in/locale issues (out of scope by design).
