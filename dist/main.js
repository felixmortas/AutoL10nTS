#!/usr/bin/env node
/**
 * Entry point for the CLI tool.
 *
 * This script:
 * - Parses CLI arguments (provider, model, ARB folder, Flutter files).
 * - Instantiates the L10nProcessor with those options.
 * - Executes the localization process.
 *
 * Example:
 *   ./main.ts --provider openai --model gpt-4o-mini --arbs-folder ./lib/l10n --files lib/main.dart
 */
import { Command } from "commander";
import { L10nProcessor } from "./l10nProcessor.js";
export { L10nProcessor } from "./l10nProcessor.js";
const program = new Command();
program
    .requiredOption("--provider <provider>", "LLM provider (mistral, openai, google)")
    .requiredOption("--model <model>", "Model name to use")
    .requiredOption("--arbs-folder <path>", "Directory of .arb localization files")
    .requiredOption("--files <files...>", "Flutter files to process");
program.option("--api-key <key>", "API key for the LLM provider");
program.parse(process.argv);
/**
 * Main execution function:
 * - Collects CLI options.
 * - Creates and runs an L10nProcessor.
 */
async function main() {
    const opts = program.opts();
    const modifier = new L10nProcessor({
        provider: opts.provider,
        model: opts.model,
        arbsFolder: opts.arbsFolder ?? opts["arbs-folder"], // Commander normalizes kebab-case differently
        files: opts.files,
        apiKey: opts.apiKey ?? process.env[`${opts.provider.toUpperCase()}_API_KEY`] ?? "",
    });
    await modifier.process();
}
main().catch((err) => {
    console.error("[ERROR]", err);
    process.exit(1); // Exit with error code
});
//# sourceMappingURL=main.js.map