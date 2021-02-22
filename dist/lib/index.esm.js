import { readdirSync, readFileSync } from 'fs';
import { deflate } from 'pako';

/**
 * Kroki Inline Api Defaults
 */
var KROKI_API_PLUGINS = [
    'plantuml',
    'c4plantuml',
    'bpmn',
    'svgbob'
];
var MD_INLINE = '```';
var KROKI_API_URL = 'https://kroki.io/';
var mdPreKrokiConfig = /** @class */ (function () {
    function mdPreKrokiConfig() {
    }
    Object.defineProperty(mdPreKrokiConfig, "apiPlugins", {
        get: function () {
            return KROKI_API_PLUGINS;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(mdPreKrokiConfig, "mdInlne", {
        get: function () {
            return MD_INLINE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(mdPreKrokiConfig, "apiUrl", {
        get: function () {
            return KROKI_API_URL;
        },
        enumerable: false,
        configurable: true
    });
    return mdPreKrokiConfig;
}());

/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */
/**
 * List all files that ends with .md
 * @param mdFilePath path naar de .md files
 */
function listMdFiles(mdFilePath) {
    var mdFiles = [];
    readdirSync(mdFilePath).forEach(function (file) {
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
function encodeKrokiDiagram(diagramSource) {
    var data = Buffer.from(diagramSource, 'utf8');
    var compressed = deflate(data, { level: 9 });
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
    var inputMdLines = readFileSync(inputMdFilePath, 'utf-8').split('\n');
    var outputMdLines = [];
    var lineIndex = 0;
    while (lineIndex < inputMdLines.length) {
        console.log("MdLine: " + inputMdLines[lineIndex]);
        if (isKrokiMdInline(inputMdLines[lineIndex])) {
            console.log('--> isKrokiInlne');
            var krokiApiPlugin = inputMdLines[lineIndex].split(mdPreKrokiConfig.mdInlne)[1].trim();
            var krokiDiagramLines = [];
            lineIndex++;
            while (!isMdInline(inputMdLines[lineIndex])) {
                krokiDiagramLines.push(inputMdLines[lineIndex]);
                lineIndex++;
            }
            if (krokiDiagramLines.length > 0) {
                var mdImageLine = '![kroki api]' +
                    '(' + mdPreKrokiConfig.apiUrl + krokiApiPlugin + '/svg/' +
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
/**
 * Check for Mark Down Inline starting Kroki Api Plugin Data
 * @param mdLine Mark Down Line string to check
 * @returns true: a Kroki Api Plugin Data Mark Down, false: is not...
 */
function isKrokiMdInline(mdLine) {
    return mdPreKrokiConfig.apiPlugins.find(function (krokiApi) { return mdLine.trim() == (mdPreKrokiConfig.mdInlne + krokiApi); });
}
/**
 * Check for Mark Down Inline
 * @param mdLine Mark Down Line to check
 * @returns true: a Mark Down Inline, false: is not...
 */
function isMdInline(mdLine) {
    return mdLine.trim() == mdPreKrokiConfig.mdInlne;
}

export { encodeKrokiDiagram, listMdFiles, preProcessKrokiMdFile };
