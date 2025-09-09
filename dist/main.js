/*
Parse CLI args (LLM provider, model, ARB folder, Flutter files).
- Load ARB files → detect languages.
- Detect source language from Flutter code using the LLM.
- For each Flutter file:
- Extract ARB entries + possible Flutter updates via LLM.
- Merge ARB updates into main ARB file.
- Update Flutter file if needed.
- Translate all ARB entries into the other languages present.
- Write everything back safely.
*/
import { Command } from 'commander'; // CLI argument parser
import fs from 'fs/promises'; // async file operations
import path from 'path'; // to handle file paths across platforms
import { LLM } from './llm.js'; // your wrapper class for calling AI providers (from llm.ts)
import { atomicWrite, mergeJsonStrings } from './utils.js'; // helper functions (likely ensure safe writes + JSON merging)
// Defines CLI arguments
const program = new Command();
program
    .requiredOption('--provider <provider>', 'LLM provider (mistral, openai, google)')
    .requiredOption('--model <model>', 'Model name to use')
    .requiredOption('--arbs-folder <path>', "Directory of .arb localization files")
    .requiredOption('--files <files...>', 'Flutter files to process');
// Parses user input into an opts object
program.parse(process.argv);
//// Main function entry
async function main() {
    // Retrieves CLI options
    const opts = program.opts();
    // Instantiates an LLM client with the chosen provider and model
    console.info('[INFO] Instantiates an LLM client with the chosen provider and model...');
    const llm = new LLM(opts.provider, opts.model);
    //// Validate ARB folder
    // Normalizes ARB folder path (handles different key naming styles)
    const l10nFolder = opts.arbsFolder || opts.arbsFolder || opts['arbsFolder'] || opts['arbs-folder'];
    const arbsFolder = path.resolve(opts.arbsFolder ?? opts['arbs-folder']);
    // Checks that the folder exists, throws error if not
    try {
        await fs.access(arbsFolder);
    }
    catch (e) {
        throw new Error(`The folder ${arbsFolder} does not exist.`);
    }
    //// Detect existing ARB files & languages
    // Lists all files in ARB folder
    const files = await fs.readdir(arbsFolder);
    // Keeps only those like app_xx.arb
    const arbFiles = files.filter((f) => f.startsWith('app_') && f.endsWith('.arb')).map((f) => path.join(arbsFolder, f));
    // Extracts xx (language tags) from filenames
    const langs = arbFiles.map((f) => path.basename(f).split('_')[1].split('.')[0]);
    // Logs detected languages
    console.debug(`[DEBUG] Detected languages: ${langs}`);
    //// Validate first Flutter file
    // Makes sure the first Flutter file exists (used for language detection)
    const firstFlutterFile = path.resolve(opts.files[0]);
    try {
        await fs.access(firstFlutterFile);
    }
    catch (e) {
        throw new Error(`Flutter file not found: ${firstFlutterFile}`);
    }
    //// Detect source language using LLM
    // Reads the first Flutter file’s contents
    const langProof = await fs.readFile(firstFlutterFile, { encoding: 'utf8' });
    // Asks the LLM to pick the right language from available langs
    console.info('[INFO] Language detection...');
    const langTagRaw = await llm.chooseLanguage(langProof, langs);
    console.info(`[INFO] Language detected : ${langTagRaw}`);
    // Cleans up the language tag (removes unwanted chars)
    const langTag = Array.from(langTagRaw).filter((c) => /[a-zA-Z0-9_-]/.test(c)).join('');
    console.info(`[INFO] Language cleaned : ${langTag}`);
    //// Prepare target ARB file
    // Defines the ARB file corresponding to the detected language
    const targetArbPath = path.join(arbsFolder, `app_${langTag}.arb`);
    // Keeps a fullArbLines accumulator to merge all updates later
    let fullArbLines = {};
    // Tries to load it, otherwise initializes as {}
    let arbContent = '{}';
    try {
        arbContent = await fs.readFile(targetArbPath, { encoding: 'utf8' });
    }
    catch (e) {
        console.warn(`[WARNING] Fichier ARB cible introuvable, initialisé à objet vide : ${targetArbPath}`);
    }
    //// Process each Flutter file
    // Iterates over all given Flutter files
    for (const filePathStr of opts.files) {
        // Reads content
        const filePath = path.resolve(filePathStr);
        try {
            await fs.access(filePath);
        }
        catch (e) {
            console.warn(`[WARNING] Fichier Flutter introuvable : ${filePath}`);
            continue;
        }
        console.info(`[INFO] Traitement du fichier : ${filePath}`);
        const flutterContent = await fs.readFile(filePath, { encoding: 'utf8' });
        // Sends content to the LLM with the current ARB and language
        const finalResponse = await llm.process(flutterContent, arbContent, langTag);
        // Format LLM response to get JSON block with new ARB lines, and optionally a <dart> section with updated Flutter code
        let striped = finalResponse.trim();
        striped = striped.replace(/<JSON>/g, '').replace(/<\/JSON>/g, '').replace(/<\/dart>/g, '');
        // Splits responses into ARB lines (to merge), and updated Flutter file (to overwrite)
        const parts = striped.split('<dart>');
        const arbLines = parts[0].trim();
        const updatedFlutter = (parts[1] || '').trim();
        console.debug(`[DEBUG] Lignes ARB créées : ${arbLines.slice(0, 200)}`);
        //// Merge ARB updates
        // Merges new ARB entries into the accumulated fullArbLines
        const parsed = JSON.parse(arbLines || '{}');
        fullArbLines = { ...fullArbLines, ...parsed };
        // Reads existing target ARB
        const fullArbJson = JSON.stringify(fullArbLines, null, 2);
        console.info(`[INFO] Mise à jour du fichier ARB : ${targetArbPath}`);
        let existing = '{}';
        try {
            existing = await fs.readFile(targetArbPath, { encoding: 'utf8' });
        }
        catch (e) {
            existing = '{}';
        }
        // Uses mergeJsonStrings to reconcile existing + new content
        const newArbContent = mergeJsonStrings(existing, fullArbJson);
        // Writes back atomically (safe write, avoids corruption)
        await atomicWrite(targetArbPath, newArbContent);
        //// Update Flutter file if modified
        if (updatedFlutter) {
            console.info(`[INFO] Mise à jour du fichier Flutter : ${filePath}`);
            await atomicWrite(filePath, updatedFlutter);
        }
    }
    //// Translate into other languages
    const otherArbFiles = arbFiles.filter((f) => f !== targetArbPath);
    console.info(`[INFO] Traduction dans les autres langues : ${otherArbFiles.map((f) => path.basename(f))}`);
    // After processing the main language, loop over all other ARB files
    for (const arbFile of otherArbFiles) {
        const lang = path.basename(arbFile).split('_')[1].split('.')[0];
        console.info(`[INFO] Traduction en cours pour : ${lang}`);
        // Calls LLM to translate fullArbLines into that language
        const translated = await llm.amendArb(JSON.stringify(fullArbLines, null, 2), lang);
        let existing = '{}';
        try {
            existing = await fs.readFile(arbFile, { encoding: 'utf8' });
        }
        catch (e) {
            existing = '{}';
        }
        // Merges into the existing ARB and writes back
        const newArbContent = mergeJsonStrings(existing, translated);
        await atomicWrite(arbFile, newArbContent);
    }
}
//// Error handling: If anything fails in main(), logs the error and exits with failure code
main().catch((err) => {
    console.error('[ERROR]', err);
    process.exit(1);
});
