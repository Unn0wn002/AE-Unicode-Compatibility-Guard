# UG-03 native check of the repaired collection (prepared 2026-11-07, Claude Code; host steps by Aria)

Status: **PREPARED, NOTHING RUN.** Every result is NOT_RUN until Aria reports it. Automated tests (72/72 node tests, static checks) use test doubles and are not After Effects evidence.

## Identity recorded before touching the host (VERIFIED_THIS_SESSION, read-only)
- Source: `556df4681fa3ee6fedbc92ef7ef331d049503eb9` (local unpushed branch `task/XP-02-20261107`; code commit `ebbe50f`). Repaired source sha256 `fc048dfed220d28890212ea54c4a21ba664c5e8dfb601405743670a0034a95f1`.
- Repaired build to install: `_qa_scratch/rebuild-20261107/dist/Unicode_Compatibility_Guard.jsx`, same sha256 `fc048dfe...95f1` (byte copy of the source).
- Currently installed: `C:/Users/unn0w/AppData/Roaming/Adobe/After Effects/26.5/Scripts/ScriptUI Panels/Unicode_Compatibility_Guard.jsx`, sha256 `e3ea3be59acfe7e5873d98a2ed09954be6a78d2f3b09048d793609eef2d01b8e` (pre-repair `b3f3e33` build). A backup copy is at `_qa_scratch/ug03/installed-before-e3ea3be5.jsx` (same hash) for rollback.
- After Effects was not running when checked. This is a per-user folder, so no administrator rights are needed.
- Fixture script (new, ASCII, uncommitted): `scripts/UCG_BuildOutputModuleFixture.jsx`. It adds one composition with TWO output modules in the render queue (module 1 ASCII path, module 2 a decomposed-name path `U+304B U+3099 U+3081 U+3093.mov`). It writes no files and starts no render.

## Expected outcomes (written before the run)
| ID | Step | Expected |
|---|---|---|
| E1 | Overwrite the installed file with the repaired build, restart AE, open the panel docked | Installed sha256 equals `fc048dfe...95f1`; panel opens docked |
| E2 | Throwaway project, run the fixture script, save the project at an ASCII path, Scan | Both output paths listed (queue 1, module 1 and module 2); module 1 SAFE; module 2 WARN "combining characters"; overall WARN; coverage Complete. Before the repair only module 1 would appear |
| E3 | New empty project, Scan | Amber "nothing checked" (NONE), never green |
| E4 | In the saved fixture project change module 2 "Output To" to an ASCII path, Scan | All paths SAFE with coverage Complete, so green is allowed only now |
| E5 | Narrow dock and English/Japanese toggle on the E2 result | Coverage line visible and not cut off; text changes language without a rescan. Record only what is observable |
| E6 | Native throwing getter (incomplete collection) | NOT_RUN natively: no deterministic way to fail a host read; controlled test evidence only |

## Host checklist for Aria (each overwrite and restart needs your own yes; I do not launch or restart After Effects)
1. Confirm After Effects is closed and give me the exact build (Help > About) once it is open.
2. Overwrite the installed file (one command, shown in chat) with the repaired build; I verify the hash.
3. Start After Effects, Window menu, open the Guard panel, dock it. Screenshot.
4. New project: File > Scripts > Run Script File... `D:\Work\Projects\AE-Unicode-Compatibility-Guard\scripts\UCG_BuildOutputModuleFixture.jsx`. Save the project to `D:\Work\Projects\AE-Unicode-Compatibility-Guard\_qa_scratch\ug03\UG03_disposable.aep`. Scan. Screenshot the full result (E2) and the narrow dock and language toggle (E5).
5. Change module 2 Output To to an ASCII path, Scan again (E4). Screenshot.
6. New empty project, Scan (E3). Screenshot.
7. Send the screenshots; I hash and record them as PASS_BOUNDED_NATIVE, FAIL or NOT_RUN. Anything unexpected becomes an investigate-first defect, never an automatic PASS.
- Rollback: copy `_qa_scratch/ug03/installed-before-e3ea3be5.jsx` back over the installed file.

## Results
E1 to E6: **NOT_RUN**.

## Results (2026-11-07 17:12 to 17:13 local; After Effects 2026 version 26.5 (build number not re-read this run); one Windows machine)
The host steps were performed by Claude Code through computer use, with Aria's approval to overwrite the installed file and to drive After Effects. Screenshots were viewed during the run but were not saved to disk, so the evidence below is the observed on-screen text recorded here (USER-granted computer use, not a file). The throwaway project `_qa_scratch/ug03/UG03_disposable.aep` was saved after the fixture script (module 2 still the decomposed name); the later ASCII edit to module 2 was left unsaved.

| ID | Result | Observation |
|---|---|---|
| E1 | PASS_BOUNDED_NATIVE | Installed file hash was `fc048dfe...95f1` (verified after the copy and again after the run) and After Effects was launched fresh; Window menu listed `Unicode_Compatibility_Guard.jsx`; the panel opened as a docked tab beside Project and JPFP_Session1_Panel. Dock persistence across a restart was NOT tested here. |
| E3 | PASS_BOUNDED_NATIVE | New empty project, Scan: amber "結果：検査対象なし" (nothing checked), 0 paths (SAFE 0, WARN 0, BLOCKED 0), coverage 全体 (complete), reason line "no paths found (is a project open?)". Not green. Japanese default UI. |
| E2 | PASS_BOUNDED_NATIVE | After `UCG_BuildOutputModuleFixture.jsx` (alert: render queue item 1 has 2 output modules) and saving the project at an ASCII path, Scan: RESULT WARN, **3 paths checked: 2 SAFE, 1 WARN, 0 BLOCKED**, coverage Complete, failed reads 0. Listed: WARN output `D:\Work\Projects\AE-Unicode-Compatibility-Guard\_qa_scratch\ug03\out\(decomposed name).mp4` with "Contains combining characters (1) - looks like a decomposed (NFD-style) name"; SAFE project `.../ug03/UG03_disposable.aep`; SAFE output `.../ug03/out/ascii_module1.mp4`. Both output modules appear (module 2 is the one the pre-repair build never read). Note: After Effects changed the requested `.mov` extension to `.mp4` for the default H.264 module; it does not affect the check. |
| E4 | PASS_BOUNDED_NATIVE | Module 2 Output To changed to `ascii_module2.mp4`, Scan: green RESULT SAFE, 3 paths 3 SAFE, coverage Complete, failed reads 0. All three paths listed. |
| E5 | PARTIAL PASS_BOUNDED_NATIVE | Language button switched the E2 result Japanese to English with no rescan (result, counts, reasons, "First problem" line all English). Narrow dock: frame dragged to about 400 px wide, English E4 result: status, counts, coverage and the list wrapped with nothing cut off; frame then restored. The incomplete-coverage warning was not observable (needs a failed read). |
| E6 | NOT_RUN natively | A native throwing getter cannot be built deterministically; only controlled test-double evidence exists (`tests/collection.test.js`; 72/72 node tests and static checks at `556df46`, not After Effects evidence). |

No defect found. Guard remains not released and not approved for distribution. Neither a clean-profile nor an all-host claim is made.
