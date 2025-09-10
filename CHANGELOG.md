# Changelog

## [0.2.0] - 2025-09-10
### Added
- Introduced the `L10nProcessor` class (`src/l10nProcessor.ts`) encapsulating all processing logic.
- Added programmatic API: you can now `import { L10nProcessor } from "auto-l10n-ts"` and call `.process()`.
- Updated CLI (`main.ts`) to delegate all logic to `L10nProcessor`.
- Added `index.ts` to expose the API for external packages.

### Changed
- Restructured project for better testability and maintainability.
- Updated README with usage examples for both CLI and programmatic API.

## [0.1.0] - 2025-09-09
### Initial Release
- Basic CLI to process Flutter and ARB files with LLM.
- Supported providers: OpenAI, Mistral, Google.
- Translation pipeline with `.arb` merging and Flutter file updates.
- Atomic writes with `.bak` backups.
