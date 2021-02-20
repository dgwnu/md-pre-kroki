/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { readdirSync, readFileSync } from 'fs';
import { deflate } from 'pako';


/**
 * Kroki Inline Api Constants
 */
const KROKI_APIS = [
    'plantuml',
    'bpmn'
];
const MD_INLINE = '````';

/**
 * List all files that ends with .md 
 * @param mdFilePath path naar de .md files
 */
export function listMdFiles(mdFilePath: string) {
    let mdFiles: string[] = [];

    readdirSync(mdFilePath).forEach(file => {
        if (file.endsWith('.kroki.md')) {
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

/**
 * Pre-Process a Kroki Mark Down File to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 * 
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
export function preProcessKrokiMdFile(inputMdFilePath: string) {
    const inputMdLines = readFileSync(inputMdFilePath, 'utf-8').split('\n');
    let outputMdLines: string[] = [];
    let lineIndex = 0;

    while (lineIndex < inputMdLines.length) {
        console.log(`MdLine: ${inputMdLines[lineIndex]}`);

        if (isKrokiInlne(inputMdLines[lineIndex])) {
            console.log('--> isKrokiInlne');
            lineIndex ++;

            while (!inputMdLines[lineIndex].startsWith(MD_INLINE)) {

            }

        } else {
            console.log('--> basicMdInlne')
            outputMdLines.push(inputMdLines[lineIndex]);
        }

        lineIndex ++;
    }

    return outputMdLines.join('\n');
}

function isKrokiInlne(mdLine: string) {
    return KROKI_APIS.find(krokiApi => mdLine.startsWith(MD_INLINE + krokiApi));
}