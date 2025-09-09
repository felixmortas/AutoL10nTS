import fs from 'fs/promises';
import path from 'path';
export async function atomicWrite(filePath, content) {
    const dir = path.dirname(filePath);
    const backupPath = filePath + '.bak';
    try {
        await fs.access(filePath);
        await fs.copyFile(filePath, backupPath);
        console.debug(`[DEBUG] Sauvegarde .bak créée : ${backupPath}`);
    }
    catch (e) {
        // file may not exist — that's ok
    }
    const tmpName = path.join(dir, `.tmp-${Date.now()}-${path.basename(filePath)}`);
    await fs.writeFile(tmpName, content, { encoding: 'utf8' });
    await fs.rename(tmpName, filePath);
    console.debug(`[DEBUG] Fichier mis à jour atomiquement : ${filePath}`);
}
export function mergeJsonStrings(existingJson, newJson) {
    try {
        console.debug('[DEBUG] Fusion des fichiers JSON...');
        const existingData = existingJson ? JSON.parse(existingJson) : {};
        const newData = newJson ? JSON.parse(newJson) : {};
        // conserver l'en-tête du premier (existing) comme dans la version Python fournie
        const merged = { ...newData, ...existingData };
        return JSON.stringify(merged, null, 2);
    }
    catch (e) {
        console.error('[ERROR] Fusion JSON échouée :', e);
        return existingJson;
    }
}
