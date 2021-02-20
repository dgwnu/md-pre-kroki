/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { readdirSync, readFileSync } from 'fs';
import { deflate } from 'pako';

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

/**
 * Encode Diagram to make Roki Api request pay-load
 * @param diagramSource 
 * @see <https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs>
 */
export function encodeDiagram(diagramSource: string) {
    const data = Buffer.from(diagramSource, 'utf8');
    const compressed = deflate(data, { level: 9 });
    return Buffer.from(compressed)
        .toString('base64') 
        .replace(/\+/g, '-').replace(/\//g, '_');
}


export function preProcessMdFile(inputMdFilePath: string) {
    const inputMdLines = readFileSync(inputMdFilePath, 'utf-8').split('\n');

    for (const inputMdLine of inputMdLines) {
        console.log(`MdLine: ${inputMdLine}`);
    }

}