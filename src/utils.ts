import fs from 'fs/promises';
import path from 'path';


export async function atomicWrite(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    const backupPath = filePath + '.bak';
    try {
        await fs.access(filePath);
        await fs.copyFile(filePath, backupPath);
        console.debug(`[DEBUG] .bak backup created : ${backupPath}`);
    } catch (e) {
        // file may not exist — that's ok
    }


    const tmpName = path.join(dir, `.tmp-${Date.now()}-${path.basename(filePath)}`);
    await fs.writeFile(tmpName, content, { encoding: 'utf8' });
    await fs.rename(tmpName, filePath);
    console.debug(`[DEBUG] Fichier mis à jour atomiquement : ${filePath}`);
}


export function mergeJsonStrings(existingJson: string, newJson: string): string {
    try {
        console.debug('[DEBUG] Merging JSON files...');
        const existingData = existingJson ? JSON.parse(existingJson) : {};
        const newData = newJson ? JSON.parse(newJson) : {};
        // conserver l'en-tête du premier (existing) comme dans la version Python fournie
        const merged = { ...newData, ...existingData };
        return JSON.stringify(merged, null, 2);
    } catch (e) {
        console.error('[ERROR] JSON merge failed :', e);
        return existingJson;
    }
}