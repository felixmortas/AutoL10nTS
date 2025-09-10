/**
 * LLM Wrapper
 *
 * Provides a unified abstraction for interacting with different LLM providers:
 * - Mistral (@langchain/mistralai)
 * - OpenAI (@langchain/openai)
 * - Google Generative AI (@langchain/google-genai)
 *
 * Responsibilities:
 * - Initializes the chosen provider/model.
 * - Loads prompt templates from disk (`prompts/` folder).
 * - Invokes the LLM with system + human messages.
 * - Extracts and returns structured outputs (marked by `REPONSE FINALE :`).
 */
import 'dotenv/config';
export declare class LLM {
    /** Which provider to use: "mistral", "openai", "google". */
    provider: string;
    /** Model name to use (depends on provider). */
    model: string;
    /** Underlying LangChain chat model instance. */
    llm: any;
    /** API key to use (depends on provider). */
    apiKey: string;
    /**
     * Constructs a new LLM instance.
     * @param provider - LLM backend (mistral, openai, google).
     * @param model - Model name or ID.
     */
    constructor(provider: string, model: string, apiKey: string);
    /**
     * Internal: Initializes the correct LangChain wrapper
     * depending on the provider.
     */
    private _initLLM;
    /**
     * Loads a system + human prompt pair from the `prompts/` folder.
     * @param name - Base name of the prompt files.
     *   - Loads `{name}.sys` (system message).
     *   - Loads `{name}.hum` (human message).
     */
    private _loadPrompt;
    /**
     * Sends system + human prompts to the LLM and returns the response.
     */
    private _invoke;
    /**
     * Determines the language tag of a Flutter file.
     * @param doc - Flutter source code.
     * @param langs - Candidate languages detected from ARB files.
     * @returns Chosen language tag.
     */
    chooseLanguage(doc: string, langs: string[]): Promise<string>;
    /**
     * Processes a Flutter file and ARB file together.
     * Extracts localization keys and potentially updates the Flutter code.
     * @param flutterFile - Flutter source code as string.
     * @param arbFile - Current ARB JSON content.
     * @param lang - Source language tag.
     * @returns String containing JSON (keys) + updated Flutter code.
     */
    process(flutterFile: string, arbFile: string, lang: string): Promise<string>;
    /**
     * Produces a translated ARB file for a target language.
     * @param inputJson - JSON string with source keys.
     * @param langTag - Target language code.
     * @returns Translated JSON string.
     */
    amendArb(inputJson: string, langTag: string): Promise<string>;
}
//# sourceMappingURL=llm.d.ts.map