"use strict";
/**
 * DGWNU Utils to use Fuseki Services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preProcessKrokiMdFile = exports.encodeKrokiDiagram = exports.listMdFiles = void 0;
/**
 * Node Package Imports
 */
const fs_1 = require("fs");
const pako_1 = require("pako");
/**
 * Kroki Inline Api Constants
 */
const KROKI_APIS = [
    'plantuml',
    'bpmn'
];
const MD_INLINE = '```';
const KROKI_API_URL = 'https://kroki.io/';
/**
 * List all files that ends with .md
 * @param mdFilePath path naar de .md files
 */
function listMdFiles(mdFilePath) {
    let mdFiles = [];
    fs_1.readdirSync(mdFilePath).forEach(file => {
        if (file.endsWith('.kroki.md')) {
            mdFiles.push(file);
        }
    });
    return mdFiles;
}
exports.listMdFiles = listMdFiles;
/**
 * Encode Diagram to make Roki Api request pay-load
 * @param diagramSource
 * @see <https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs>
 */
function encodeKrokiDiagram(diagramSource) {
    const data = Buffer.from(diagramSource, 'utf8');
    const compressed = pako_1.deflate(data, { level: 9 });
    return Buffer.from(compressed)
        .toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_');
}
exports.encodeKrokiDiagram = encodeKrokiDiagram;
/**
 * Pre-Process a Kroki Mark Down File to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 *
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
function preProcessKrokiMdFile(inputMdFilePath) {
    const inputMdLines = fs_1.readFileSync(inputMdFilePath, 'utf-8').split('\n');
    let outputMdLines = [];
    let lineIndex = 0;
    while (lineIndex < inputMdLines.length) {
        console.log(`MdLine: ${inputMdLines[lineIndex]}`);
        if (isKrokiMdInline(inputMdLines[lineIndex])) {
            console.log('--> isKrokiInlne');
            const krokiApiPlugin = inputMdLines[lineIndex].split(MD_INLINE)[1].trim();
            let krokiDiagramLines = [];
            lineIndex++;
            while (!isMdInline(inputMdLines[lineIndex])) {
                krokiDiagramLines.push(inputMdLines[lineIndex]);
                lineIndex++;
            }
            if (krokiDiagramLines.length > 0) {
                const mdImageLine = '![kroki api]' +
                    '(' + KROKI_API_URL + krokiApiPlugin + '/svg/' +
                    encodeKrokiDiagram(krokiDiagramLines.join('\n')) + ' "kroki.io")';
                console.log(`--> mdImageLine = ${mdImageLine}`);
                outputMdLines.push(mdImageLine);
            }
        }
        else {
            console.log('--> basicMdInlne');
            outputMdLines.push(inputMdLines[lineIndex]);
        }
        lineIndex++;
    }
    return outputMdLines.join('\n');
}
exports.preProcessKrokiMdFile = preProcessKrokiMdFile;
function isKrokiMdInline(mdLine) {
    return KROKI_APIS.find(krokiApi => mdLine.trim() == (MD_INLINE + krokiApi));
}
function isMdInline(mdLine) {
    return mdLine.trim() == MD_INLINE;
}
