# Native run: ScriptUI panel v0.2 — floating, installed and docked — 2026-11-01

Host: After Effects 2026 (26.5 preferences folder), Windows 11, one machine; build number not recorded. Script: `src/UCG_Probe.jsx` v0.2 (ScriptUI panel replacing the alert dialog; the core logic is unchanged and still covered by the 18 unit tests). Fixture project: `_qa_scratch\fixtures\日本語プロジェクト\テスト.aep` (inside this project folder, git-ignored) with the 5 fixture footage items; `missing\消える.png` had been deleted, so After Effects warns "1 file is missing since you last saved this project" on open. Owner approval: "convert it, if u need restart, im allowed u to restart it" (the install and restart were part of making the converted panel testable). Driven through the UI by Claude.

## Observed
1. **Floating (Run Script File):** a "Unicode Compatibility Guard" palette opened with a "Scan project" button and a text area. Scan result: "RESULT: BLOCKED — 6 paths checked: 3 SAFE, 2 WARN, 1 BLOCKED". Items are listed problems first: BLOCKED `missing\消える.png` ("File was not found at the stored path…"), WARN `nfd\…` (combining characters, decomposed name), WARN the 246-character path, then the three SAFE items: the project file `日本語プロジェクト\テスト.aep` (note: non-ASCII, 0 hiragana, 9 katakana, 3 kanji), `ascii\plain.png`, and `日本語フォルダ\テスト画像.png`. Every item shows its kind (project/footage) and location class (LOCAL_OR_MAPPED). This closes the earlier gap that SAFE items and location classes were visible only in the console JSON.
2. **Install:** copy at `dist\Unicode_Compatibility_Guard.jsx` (SHA-256 `02495C4EFFC55F8287A5CD8791334B2F02DB365D80A16D9FA9B3C989A85BDA36`). File > Scripts > Install ScriptUI Panel… copied it to `C:\Users\unn0w\AppData\Roaming\Adobe\After Effects\26.5\Scripts\ScriptUI Panels\Unicode_Compatibility_Guard.jsx` (11,488 bytes, identical hash). The Program Files panels folder was not touched. The per-user folder now holds this and the Sentinel's panel.
3. **Restart:** After Effects' own prompt asked for a restart; I accepted. No save prompt appeared (the fixture project had no changes). On restart the home screen listed the fixture project; I reopened it (same missing-file warning).
4. **Window menu:** now lists `Unicode_Compatibility_Guard.jsx` (and `Write_Health_Sentinel.jsx`). It opened as a floating panel with a tab.
5. **Docking:** a slow drag over the Project panel group showed the blue drop highlight; releasing docked it as a tab in that group (Project | Unicode_Compatibility_Guard | Write_Health_Sentinel | Effect Controls).
6. **Scan in the dock:** same result as the floating run (BLOCKED; 3 SAFE, 2 WARN, 1 BLOCKED; same items and reasons).

## Result
- Panel conversion and itemized output: PASS_BOUNDED_NATIVE (U11).
- Install through the supported menu + restart + Window menu entry: PASS_BOUNDED_NATIVE (U12).
- Docked panel gives the same results as floating: PASS_BOUNDED_NATIVE (U13).
- Unit tests 18/18 and static checks (now also requiring `instanceof Panel`, a palette fallback and no modal dialogs) pass.

## Not established
- The OneDrive/cloud, SMB, macOS and 260+ character cases (unchanged from the earlier run: U07 was earlier checked, U08 NOT_RUN, U09 BLOCKED, U10 NOT_RUN).
- Behaviour with several hundred footage items, nested folders or other After Effects builds.
- Whether this project's dock position persists across a further restart (the Sentinel's did; this one was not restarted again).

## State left / how to undo
- The installed file is a COPY; re-install after code changes. To uninstall: close After Effects, delete `C:\Users\unn0w\AppData\Roaming\Adobe\After Effects\26.5\Scripts\ScriptUI Panels\Unicode_Compatibility_Guard.jsx`, restart.
- After Effects is open on the fixture project (unmodified) with the panel docked in the left group.
