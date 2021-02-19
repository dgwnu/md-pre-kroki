/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { readdirSync, existsSync, unlinkSync } from 'fs';

/**
 * Local Library Imports
 */

/**
 * List all files that ends with .md 
 * @param mdFilePath path naar de .md files
 */
export function listMdFiles(mdFilePath: string) {
    let mdFiles: string[] = [];

    readdirSync(mdFilePath).forEach(file => {
        if (file.endsWith('.md')) {
            mdFiles.push(file);
        }
    });

    return mdFiles;
}