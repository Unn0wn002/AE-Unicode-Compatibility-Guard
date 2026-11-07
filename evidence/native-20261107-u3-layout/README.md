# Native check: Guard panel spacing (U3, 2026-11-07, Claude Code via computer use)

Class: PASS_BOUNDED_NATIVE (layout only), one Windows machine, After Effects 2026 (26.5). `src/UCG_Probe.jsx` sha256 `43c25fc40ed7b4edba483b939e6d328010030be13bd66691be24f7fa8294e1ee`. Screenshots were viewed and not saved.

## What changed
The intro, counts and coverage blocks had fixed heights (84, 34 and 64 px), which left a blank band in a wide dock. Their heights now follow an estimate of the wrapped text for the current width; the coverage block keeps a minimum of 40 px. Scan logic and texts are unchanged.

## Observed (two-output-module fixture, result WARN)
- Docked at about 245 px: the intro takes 3 lines and the buttons sit directly beneath it (no blank band), then RESULT: WARN, "2 paths checked: 1 SAFE, 1 WARN, 0 BLOCKED", the counters and the first problem.
- Floating palette with the final file: the intro takes 2 lines, the buttons follow, and "Coverage: Complete; failed reads: 0" is shown between the counts and the counters.
- A first version that sized the coverage block to exactly one line made that line disappear in After Effects; it was fixed with the 40 px minimum and re-checked in the floating palette. The docked copy installed after that fix was not viewed again.

## Side effect
A stray click ran the render queue of the throwaway fixture once, writing two small `.mp4` files into the git-ignored `_qa_scratch/ug03/out/`.

## Not covered
Japanese UI, a result with the incomplete-coverage note, widths above about 400 px. Unit tests 72/72 and static checks pass (test doubles). Gate unchanged: not approved for distribution.
