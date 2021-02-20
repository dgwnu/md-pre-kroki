'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var pako = require('pako');

/**
 * DGWNU Utils to use Fuseki Services
 */
/**
 * Kroki Inline Api Constants
 */
var KROKI_APIS = [
    'plantuml',
    'bpmn'
];
var MD_INLINE = '```';
var KROKI_API_URL = 'https://kroki.io/';
/**
 * List all files that ends with .md
 * @param mdFilePath path naar de .md files
 */
function listMdFiles(mdFilePath) {
    var mdFiles = [];
    fs.readdirSync(mdFilePath).forEach(function (file) {
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
function encodeKrokiDiagram(diagramSource) {
    var data = Buffer.from(diagramSource, 'utf8');
    var compressed = pako.deflate(data, { level: 9 });
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
function preProcessKrokiMdFile(inputMdFilePath) {
    var inputMdLines = fs.readFileSync(inputMdFilePath, 'utf-8').split('\n');
    var outputMdLines = [];
    var lineIndex = 0;
    while (lineIndex < inputMdLines.length) {
        console.log("MdLine: " + inputMdLines[lineIndex]);
        if (isKrokiMdInline(inputMdLines[lineIndex])) {
            console.log('--> isKrokiInlne');
            var krokiApiPlugin = inputMdLines[lineIndex].split(MD_INLINE)[1].trim();
            var krokiDiagramLines = [];
            lineIndex++;
            while (!isMdInline(inputMdLines[lineIndex])) {
                krokiDiagramLines.push(inputMdLines[lineIndex]);
                lineIndex++;
            }
            if (krokiDiagramLines.length > 0) {
                var mdImageLine = '![kroki api]' +
                    '(' + KROKI_API_URL + krokiApiPlugin + '/svg/' +
                    encodeKrokiDiagram(krokiDiagramLines.join('\n')) + ' "kroki.io")';
                console.log("--> mdImageLine = " + mdImageLine);
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
function isKrokiMdInline(mdLine) {
    return KROKI_APIS.find(function (krokiApi) { return mdLine.trim() == (MD_INLINE + krokiApi); });
}
function isMdInline(mdLine) {
    return mdLine.trim() == MD_INLINE;
}

exports.encodeKrokiDiagram = encodeKrokiDiagram;
exports.listMdFiles = listMdFiles;
exports.preProcessKrokiMdFile = preProcessKrokiMdFile;
