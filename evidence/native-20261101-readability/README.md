# Native run: coloured result line — 2026-11-01

Owner request: make the plugins' UI easier to see. Code: commit 3feb08d (bold coloured result line and counts line above the details; tone mapping `ucgTone` unit-tested). Installed copy refreshed (Overwrite) and After Effects restarted (allowed); installed hash = source hash (`25A4E8F0E73B5BC4…`).

## Observed (After Effects 2026, docked, Japanese UI, fixture project with one deleted file)
「プロジェクトをスキャン」 → headline 「結果：BLOCKED（要対応）」 and 「6 件のパスを確認：SAFE 3 件、WARN 2 件、BLOCKED 1 件」 in bold red above the itemised details. Font-size increase not clearly visible in the dock; bold and colour are. Green/amber headlines not shown natively this run (unit-tested only).

## Result
U15 coloured result line (red path): PASS_BOUNDED_NATIVE. Tests 24/24.
