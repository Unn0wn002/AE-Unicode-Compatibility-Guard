# Known limitations

- Native evidence is bounded: one Windows machine, one After Effects 2026 build (number not recorded), small disposable projects, local disk plus one OneDrive file.
- The SMB/network and macOS cases from the research sheet were NOT reproduced. The "non-ASCII on a network path = WARN" rule is an encoding of the sheet's finding, not something observed here.
- NFD detection is a heuristic from combining characters. ExtendScript cannot normalize, and Windows file systems mostly ignore the difference, so a WARN means "may not match on other systems", not "will fail".
- Windows path-length thresholds (240 warn, 260 block) assume the classic limit; long-path support was not checked.
- Existence uses After Effects' own missing-footage state plus File.exists; it can't tell why a file is missing.
- Large projects produce a long text list in the panel (scrollable); no export-to-file yet.
- A mapped network drive letter looks local; cloud-sync detection is by folder name only.
- Does not relink, repair or advise beyond the message text; does not cover plug-in localization or expressions.
- Japanese UI text has not been reviewed by a native speaker. The JSON report on the console stays in English.

## 2026-11-06 local candidate - collection coverage (UG-01 / UG-02)

- The uncommitted source now enumerates every render-queue output module. It reports `coverage` (`COMPLETE`, `PARTIAL`, `UNKNOWN`) and English `collectionFailures` (`operation`, nullable `itemIndex` / `moduleIndex`, `message`) in console JSON. For output failures, `itemIndex` identifies the render-queue item; for footage failures, it identifies the project item.
- Coverage describes the attempted inventory reads, not proof that every host path is accessible or compatible. Successful inventory counts (including zero) and a readable saved-project path are observations. Failed reads with surviving observations produce `PARTIAL`; failed reads without an established observation produce `UNKNOWN`.
- Incomplete coverage produces an overall WARN unless a collected path is BLOCKED. A complete scan with no paths remains NONE. Successfully evaluated paths can still be individually SAFE; their count stays neutral when coverage is incomplete.
- A null, unassigned output file is retained as an empty-path, not-checked WARN item without fabricating a read exception. Intentionally non-file sources are skipped without a collection failure.
- Automated evidence is `CONTROLLED_NODE_TEST_DOUBLES_NOT_NATIVE`. Actual After Effects getter/error semantics, the new coverage text in a docked panel, and Japanese wording acceptance are NOT_RUN. The source has not been copied to `dist/` or installed, so existing native evidence does not validate these repairs.
