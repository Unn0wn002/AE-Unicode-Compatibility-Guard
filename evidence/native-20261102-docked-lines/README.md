# Native check: installed and docked result lines (2026-11-02)

Class: PASS_BOUNDED_NATIVE (one machine, After Effects 2026, panel docked beside Project, about 230 px wide).

Install: the owner allowed it. The merged `src\UCG_Probe.jsx` was copied to the per-user `ScriptUI Panels` folder (the previous copy was kept in the session scratchpad), After Effects was restarted, and the panel was opened from the Window menu. Fixture project: `_qa_scratch\fixtures\日本語プロジェクト\テスト.aep`.

| Check | Result | Evidence |
|---|---|---|
| v1 (merged in PR #1) docked: coloured lines show, but the counts line and the first-problem line are cut off at the right edge | FAIL (found) | `guard-docked-v1-clipped.jpg` |
| v2 (this branch): both lines wrap; BLOCKED 1 (red), WARN 2 (amber), SAFE 3 (green); first problem readable | PASS_BOUNDED_NATIVE | `guard-docked-v2-wrapped.jpg` |

Fix: the counts and first-problem lines are multiline and fill the panel width; the path shortening limit is 60 characters. Display only. Unit tests 27 pass, static checks ok. The installed file equals `src\UCG_Probe.jsx` (sha256 9472237a...). The wording is not reviewed by a native speaker.
