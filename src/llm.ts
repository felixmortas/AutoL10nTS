/*
This class is a LangChain wrapper that:
- Configures and initializes a specific LLM provider (Mistral, OpenAI, or Google).
- Loads predefined prompt templates from files.
- Calls the LLM with system + human messages.
- Extracts structured results marked by REPONSE FINALE :.
 */

import 'dotenv/config'; // Automatically loads environment variables from a .env file into process.env
import { readFile } from 'fs/promises'; // Asynchronous file reading from Node’s promise-based FS API
import path from 'path'; // Node’s path utilities (builds platform-independent paths)
import { HumanMessage, SystemMessage } from '@langchain/core/messages'; // Standard LangChain message objects representing user/system instructions in a conversation
// LangChain wrappers for different LLM providers (Mistral, OpenAI, Google).
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Class Declaration
export class LLM {
  /*
  This class encapsulates the logic for working with LLMs.
  - provider: which backend to use (mistral, openai, google).
  - model: the model name/ID.
  - llm: the actual initialized LangChain model instance.
  */
  provider: string;
  model: string;
  llm: any;

  // Constructor
  constructor(provider: string, model: string) {
    /* 
    When you create a new LLM instance:
    - Stores provider and model.
    - Calls _initLLM() (instantiates the right LangChain wrapper).
    */
    this.provider = provider;
    this.model = model;
    this.llm = this._initLLM();
  }

  private _initLLM() {
    console.debug(`[DEBUG] Initialisation du LLM ${this.provider} avec modèle ${this.model}`);
    // Chooses the right LangChain wrapper depending on this.provider
    if (this.provider === 'mistral') {
      // @langchain/mistralai reads MISTRAL_API_KEY from env by default
      return new ChatMistralAI({ model: this.model, temperature: 0, maxRetries: 5 });
    } else if (this.provider === 'openai') {
      // @langchain/openai reads OPENAI_API_KEY from env by default
      return new ChatOpenAI({ model: this.model, temperature: 0 });
    } else if (this.provider === 'google') {
      // @langchain/google-genai reads GOOGLE_API_KEY from env by default
      return new ChatGoogleGenerativeAI({ model: this.model, temperature: 0 });
    } else {
      // Throws an error if provider is unknown
      throw new Error(`Fournisseur inconnu : ${this.provider}`);
    }
  }

  private async _loadPrompt(name: string): Promise<[string, string]> {
    //// Loads two prompt files from a prompts/ folder
    // {name}.sys: system instructions
    const sysPath = path.join('prompts', `${name}.sys`);
    // {name}.hum: user instructions
    const humPath = path.join('prompts', `${name}.hum`);
    // Reads both files in parallel
    try {
      const [sysPrompt, humPrompt] = await Promise.all([
        readFile(sysPath, { encoding: 'utf8' }),
        readFile(humPath, { encoding: 'utf8' }),
      ]);
      // Returns their contents as [systemPrompt, humanPrompt]
      return [sysPrompt, humPrompt];
    } catch (e) {
      // If either is missing, throws an error
      throw new Error(`Prompt ${name} manquant : ${sysPath} ou ${humPath}`);
    }
  }

  private async _invoke(sysPrompt: string, humPrompt: string): Promise<string> {
    console.debug('[DEBUG] Appel au LLM...');
    // Builds a messages array with a system + human message
    const messages = [new SystemMessage({ content: sysPrompt }), new HumanMessage({ content: humPrompt })];
    // Calls this.llm.invoke(messages) → sends prompts to the model
    const response = await this.llm.invoke(messages);
    // Extracts and trims the response content
    return (response?.content ?? '').trim();
  }

  async chooseLanguage(doc: string, langs: string[]): Promise<string> {
    // Loads chooseLanguage.sys + chooseLanguage.hum templates
    const [sysPromptTemplate, humPromptTemplate] = await this._loadPrompt('chooseLanguage');
    // Injects the candidate languages and the document text
    const sysPrompt = sysPromptTemplate.replace('{langs}', langs.join(', '));
    const humPrompt = humPromptTemplate.replace('{doc}', doc);

    // Calls _invoke() to query the LLM
    const response = await this._invoke(sysPrompt, humPrompt);

    // Expects the LLM output to contain a marker REPONSE FINALE :
    const parts = response.split('REPONSE FINALE :');
    if (parts.length < 2) throw new Error(`Réponse invalide du LLM : ${response}`);
    // Returns only the part after that marker
    return parts[1].trim();
  }

  async process(flutterFile: string, arbFile: string, lang: string): Promise<string> {
    // Loads process.sys + process.hum
    const [sysPromptTemplate, humPromptTemplate] = await this._loadPrompt('process');
    // Replaces placeholders with actual file paths + language
    const humPrompt = humPromptTemplate.replace('{arb_file}', arbFile).replace('{flutter_file}', flutterFile).replace('{lang}', lang);

    // Calls the LLM
    const response = await this._invoke(sysPromptTemplate, humPrompt);

    // Extracts the final result after REPONSE FINALE :
    const parts = response.split('REPONSE FINALE :');
    if (parts.length < 2) throw new Error(`Format de réponse invalide : ${response}`);
    return parts[1].trim();
  }

  async amendArb(inputJson: string, langTag: string): Promise<string> {
    // Loads amendArb.sys + amendArb.hum
    const [sysPromptTemplate, humPromptTemplate] = await this._loadPrompt('amendArb');
    // Injects JSON and language tag
    const humPrompt = humPromptTemplate.replace('{lang_tag}', langTag).replace('{input}', inputJson);

    // Calls LLM
    const response = await this._invoke(sysPromptTemplate, humPrompt);

    // Extracts final response after the last REPONSE FINALE :
    const parts = response.split('REPONSE FINALE :');
    if (parts.length < 2) throw new Error(`Réponse invalide du LLM : ${response}`);
    return parts.slice(-1)[0].trim();
  }
}