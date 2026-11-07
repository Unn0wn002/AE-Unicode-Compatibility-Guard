# Native check: coloured count lines and first problem (2026-11-02)

Class: PASS_BOUNDED_NATIVE for the floating panel only. After Effects 2026, one machine.

What changed (branch `ui/result-lines-20261102`, display only): three coloured lines under the headline (BLOCKED red, WARN amber, SAFE green; a zero count stays grey) and a "first problem" line with the path shortened for the narrow dock. Scan results and the JSON report are unchanged.

How it was run: the fixture project `_qa_scratch\fixtures\日本語プロジェクト\テスト.aep` (one deliberately missing file, so After Effects showed its own "1 file is missing" warning) was opened, then `src\UCG_Probe.jsx` was run with File > Scripts > Run Script File. The panel was NOT installed, so this is a floating window.

| Check | Result | Evidence |
|---|---|---|
| Japanese scan: BLOCKED 1 (red), WARN 2 (amber), SAFE 3 (green), first problem shortened | PASS_BOUNDED_NATIVE | `guard-ja-scan.jpg` |
| English switch redraws the same lines | PASS_BOUNDED_NATIVE | `guard-en-scan.jpg` |
| Language put back to Japanese afterwards | done | n/a |
| Installed and docked in a narrow dock | NOT_RUN | needs an install, which needs the owner's yes |
| An all-SAFE scan (zero counts grey, no first-problem line) | NOT_RUN natively; helper functions covered by unit tests | `tests/core.test.js` |

Japanese wording is not reviewed by a native speaker. Unit tests: 27 pass (core + i18n), static checks ok.
