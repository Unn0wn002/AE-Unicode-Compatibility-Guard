# AE Unicode Compatibility Guard

A read-only After Effects ScriptUI panel that scans the project path, footage file paths and render-queue output paths for Japanese / non-ASCII path risks and reports SAFE / WARN / BLOCKED per path.

**Status: v0.3 panel (Japanese-first, English toggle), bounded beta on `main` `b3f3e33`. Not released, not approved for distribution.** See PROJECT_STATUS.md for current status. Native evidence covers one Windows machine and one After Effects 2026 build. See `PROJECT_STATUS.md`, `TEST_MATRIX.md`, `KNOWN_LIMITATIONS.md` and `evidence/`.

## Use
File > Scripts > Run Script File… > `src/UCG_Probe.jsx` opens a floating panel; click **Scan project**. It lists the counts and EVERY path (problems first) with kind, location class and reasons. A JSON report also goes to the ExtendScript console.

## Language
The panel starts in Japanese. The 「English」 / 「日本語」 button switches language and is remembered in After Effects' settings. Edit text in `i18n/messages.json`, then run `python -I -X utf8 scripts/gen_i18n.py`.

## Install and docking
File > Scripts > Install ScriptUI Panel… and pick the file (make a copy named `Unicode_Compatibility_Guard.jsx` first for a nicer menu name), restart After Effects, then Window > Unicode_Compatibility_Guard.jsx. Drag its tab slowly onto a panel group until the blue drop highlight appears, then release. After Effects copies it to your per-user preferences `Scripts\ScriptUI Panels` folder; re-install after code changes; delete that file to uninstall. See `evidence/native-20261101-panel-v02/`. The script never relinks, renames, replaces, saves, opens or closes anything.

## Tests
```
node --test tests/*.test.js
python -I -X utf8 tests/static_checks.py
```
These use test doubles for the pure logic; they are not After Effects evidence.

## Native test fixtures
`scripts/make_fixtures.py` generates fixtures into `_qa_scratch/fixtures/` (git-ignored). `scripts/UCG_BuildFixtureProject.jsx` imports them into the OPEN project, so run it only in a disposable project.

## User guide

See [USER_GUIDE.md](USER_GUIDE.md) for what it does, install, use, reading the result and removal.

## License

MIT. See [LICENSE](LICENSE). This beta is not approved for distribution; the license covers the source only.
