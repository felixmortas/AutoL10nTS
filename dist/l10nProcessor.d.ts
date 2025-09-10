/**
 * L10nProcessor
 *
 * Orchestrates the full localization workflow:
 * 1. Validates the ARB folder and detects available languages.
 * 2. Detects the source language from a Flutter file.
 * 3. Uses the LLM to extract ARB keys and update Flutter files.
 * 4. Writes/merges ARB updates atomically.
 * 5. Translates ARB keys into all other detected languages.
 */
export interface L10nProcessorOptions {
    provider: string;
    model: string;
    arbsFolder: string;
    files: string[];
}
export declare class L10nProcessor {
    private llm;
    private opts;
    constructor(opts: L10nProcessorOptions);
    /**
     * Executes the localization workflow:
     * - Reads ARB files and Flutter source files.
     * - Extracts new localization keys via the LLM.
     * - Updates ARB and Flutter files safely.
     * - Generates translations for other locales.
     */
    process(): Promise<void>;
}
//# sourceMappingURL=l10nProcessor.d.ts.map