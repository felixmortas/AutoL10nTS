/**
 * Writes content atomically to a file:
 * - Creates a temporary file.
 * - Renames it to the target path (atomic move).
 * - Optionally creates a `.bak` backup if the file already exists.
 *
 * Ensures consistency even if the process crashes midway.
 */
export declare function atomicWrite(filePath: string, content: string): Promise<void>;
/**
 * Merges two JSON strings by:
 * - Parsing both into objects.
 * - Combining them with preference for keys in `existingJson`.
 * - Returns a pretty-printed merged JSON string.
 *
 * If parsing fails, returns `existingJson` unchanged.
 */
export declare function mergeJsonStrings(existingJson: string, newJson: string): string;
//# sourceMappingURL=utils.d.ts.map