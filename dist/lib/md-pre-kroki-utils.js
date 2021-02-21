"use strict";
/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preProcessKrokiMdFile = exports.encodeKrokiDiagram = exports.listMdFiles = void 0;
/**
 * Node Package Imports
 */
const fs_1 = require("fs");
const pako_1 = require("pako");
/**
 * Local Package Imports
 */
const md_pre_kroki_config_1 = require("./md-pre-kroki-config");
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
            const krokiApiPlugin = inputMdLines[lineIndex].split(md_pre_kroki_config_1.mdPreKrokiConfig.mdInlne)[1].trim();
            let krokiDiagramLines = [];
            lineIndex++;
            while (!isMdInline(inputMdLines[lineIndex])) {
                krokiDiagramLines.push(inputMdLines[lineIndex]);
                lineIndex++;
            }
            if (krokiDiagramLines.length > 0) {
                const mdImageLine = '![kroki api]' +
                    '(' + md_pre_kroki_config_1.mdPreKrokiConfig.apiUrl + krokiApiPlugin + '/svg/' +
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
/**
 * Check for Mark Down Inline starting Kroki Api Plugin Data
 * @param mdLine Mark Down Line string to check
 * @returns true: a Kroki Api Plugin Data Mark Down, false: is not...
 */
function isKrokiMdInline(mdLine) {
    return md_pre_kroki_config_1.mdPreKrokiConfig.apiPlugins.find(krokiApi => mdLine.trim() == (md_pre_kroki_config_1.mdPreKrokiConfig.mdInlne + krokiApi));
}
/**
 * Check for Mark Down Inline
 * @param mdLine Mark Down Line to check
 * @returns true: a Mark Down Inline, false: is not...
 */
function isMdInline(mdLine) {
    return mdLine.trim() == md_pre_kroki_config_1.mdPreKrokiConfig.mdInlne;
}
