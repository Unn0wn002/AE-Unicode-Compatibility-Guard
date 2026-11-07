# AE Unicode Compatibility Guard: user guide

Host: Adobe After Effects 2026 (tested on 26.5). Status: beta, not released.

## What it does
Scans the project path, every footage file path and every render-queue output path (all output modules) for Japanese or non-ASCII path risks, and reports SAFE, WARN or BLOCKED per path. It is read-only: it never relinks, renames or edits anything.

## What it does not do
It does not repair paths, check network shares natively, or check macOS paths. An empty scan means NOTHING CHECKED, never "safe".

## Install
1. In After Effects choose File > Scripts > Install ScriptUI Panel... and pick `src/UCG_Probe.jsx`. (Make a copy named `Unicode_Compatibility_Guard.jsx` first for a nicer menu name.)
2. Restart After Effects, then open Window > Unicode_Compatibility_Guard.jsx and dock it as a tab.
3. To try it without installing: File > Scripts > Run Script File... and pick `src/UCG_Probe.jsx`.

## Use
1. Open your project (save it first so the project path is included).
2. Press **Scan project** (プロジェクトをスキャン).
3. Read the result line and counts, then the list: every path is shown, problems first, with its kind, location and the reason.
4. The language button switches Japanese and English without rescanning.

## Reading the result
SAFE: no risk found for that path. WARN: a risk such as a decomposed (NFD) name or a very long path. BLOCKED: a missing file. The location class (for example cloud-synced) is shown as a note. Green appears only when every path is SAFE and the coverage is Complete. If reading some items fails, coverage shows Partial or Unknown and the result is never green.

## Remove
Delete `Unicode_Compatibility_Guard.jsx` from your per-user `Scripts\ScriptUI Panels` folder and restart After Effects. (Removal has not been tested natively.)

## Limits
- Not tested natively: network (SMB) shares with non-ASCII names, real paths of 260 characters or more, macOS, and the failing-read path (unit tests only).
- Beta, not released and not approved for distribution. Verified on one Windows machine only; no macOS, other-build or clean-profile claim is made (see `PROJECT_STATUS.md`).
- The Japanese wording has not had a native-speaker review.
- A scan describes what was checked. It never certifies the final output of your project.

Full status and evidence: `PROJECT_STATUS.md`. Licence: MIT (see `LICENSE`).
