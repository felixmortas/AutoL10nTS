# Changelog

## [0.3.0] - 2025-09-10
### Added
- Updated `L10nProcessor` and `LLM` to accept API key via constructor instead of `.env`.

### Changed
- Removed dependency on `.env` for API keys.

## [0.2.2] - 2025-09-10
### Changed
- Fix L10nProcessor not importable when loaded as package

## [0.2.1] - 2025-09-10
### Changed
- TypeScript types are now fully supported for `auto-l10n-ts` package (added `.d.ts` declarations).

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
