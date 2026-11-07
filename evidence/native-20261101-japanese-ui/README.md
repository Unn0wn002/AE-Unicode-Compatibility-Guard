# Native run: Japanese-first UI (v0.3) — 2026-11-01

Host: After Effects 2026 (26.5 preferences folder), Windows 11, one machine; build number not recorded. Owner request: "Yes, add Japanese UI". Code: commits 4b64055 (Japanese UI, message codes with parameters, i18n tests) and a428018 (taller intro text). Installed copy refreshed twice through File > Scripts > Install ScriptUI Panel (Overwrite) and After Effects restarted twice (allowed by the owner). Installed file hash = source hash after each install (last: `88E19FC06053D80B…`). Fixture project: `_qa_scratch\fixtures\日本語プロジェクト\テスト.aep` (one deleted file, so After Effects warns on open).

## How the text is stored
`i18n/messages.json` (33 keys per language) → `scripts/gen_i18n.py` → `\u` escapes inside `src/UCG_Probe.jsx`, which stays pure ASCII (static check). Results carry `codes` / `noteCodes` of the form `{ k: key, p: params }` next to the English reasons, so numbers such as the path length or character counts are filled into the translated text.

## Observed
1. Docked Guard tab in Japanese: 「プロジェクトをスキャン」「English」, hint 「「プロジェクトをスキャン」をクリックしてください。」.
2. Scan: 「結果：BLOCKED（要対応）」, 「6 件のパスを確認：SAFE 3 件、WARN 2 件、BLOCKED 1 件」; items with translated kind and location (e.g. 「BLOCKED（要対応）［フッテージ、ローカル（またはドライブ割り当て）］」) and reasons (「保存されているパスにファイルが見つかりません。」「パスに非 ASCII 文字が含まれています。…」「結合文字が含まれています（1 個）。…」). Same counts and items as the English runs.
3. 「English」 redrew the same result in English without re-scanning (“RESULT: BLOCKED … 6 paths checked: 3 SAFE, 2 WARN, 1 BLOCKED”); 「日本語」 switched back.
4. Finding: the last line of the Japanese description was cut off in the narrow dock; fixed (a428018), re-installed, restarted: the full description 「…一切行いません。」 is visible.

## Result
- U14 Japanese UI with English toggle, docked, same scan result: PASS_BOUNDED_NATIVE.
- Tests 23/23 (18 core + 5 translation coverage, including "every returned code has text and all placeholders are filled"); static checks pass.

## Not established
Native-speaker review of the Japanese text; language persistence across restart in isolation.
