# Changelog

## Unreleased
- 2026-11-01: v0 probe, 18 core tests, static checks, fixture generator/builder, native U01-U07 recorded (bounded).
- 2026-11-01 (later): v0.2 ScriptUI panel with itemized results (UG1 closed); floating + installed + docked verified natively once; 18 tests.
- 2026-11-01 (later): v0.3 Japanese-first UI with English toggle; message codes with parameters; i18n generator and coverage tests (23 total); intro height fix; native check docked PASS.
- 2026-11-01 (later): readability: large coloured result line/badge (green/amber/red); tone mapping unit-tested; native check recorded; 24 tests.
- 2026-11-02: result lines: coloured BLOCKED/WARN/SAFE count lines (zero stays grey) and a shortened first-problem line; helpers unit-tested; native floating check recorded (docked NOT_RUN); 27 tests.
- 2026-11-02: dock fix: counts and first-problem lines wrap in a narrow dock (found by the docked check); native docked check PASS_BOUNDED_NATIVE.
- 2026-11-02: empty scan is no longer an all-clear: a scan with no paths (for example an unsaved project with no footage) now reports NOTHING CHECKED / 検査対象なし in amber instead of a green SAFE (found while auditing the panels after the AE Glyph false-green bug). Core and tone unit-tested (27 tests); native check NOT_RUN.
