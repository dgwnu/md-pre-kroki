import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, readFileSync, copyFileSync } from 'fs';
import { join, sep } from 'path';
import { deflate } from 'pako';

/**
 * Kroki Inline Api Defaults
 */
var KROKI_API_PLUGINS = [
    'blockdiag',
    'bpmn',
    'bytefield',
    'seqdiag',
    'actdiag',
    'nwdiag',
    'packetdiag',
    'rackdiag',
    'c4plantuml',
    'ditaa',
    'erd',
    'excalidraw',
    'graphviz',
    'mermaid',
    'nomnoml',
    'plantuml',
    'svgbob',
    'umlet',
    'vega',
    'vegalite',
    'wavedrom'
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
function listMdFilePaths(mdFilePath) {
    var mdFiles = [];
    readdirSync(mdFilePath).forEach(function (file) {
        var inputFilePath = join(mdFilePath, file);
        if (statSync(inputFilePath).isDirectory()) {
            // a directory recurse to underlying directorie(s) and file(s)
            var mdDirFilePaths = listMdFilePaths(inputFilePath);
            for (var _i = 0, mdDirFilePaths_1 = mdDirFilePaths; _i < mdDirFilePaths_1.length; _i++) {
                var mdDirFilePath = mdDirFilePaths_1[_i];
                mdFiles.push(mdDirFilePath);
            }
        }
        else if (file.endsWith('.md')) {
            // add Mark Down File to Pre-Process
            mdFiles.push(inputFilePath);
        }
    });
    return mdFiles;
}
/**
 * Write Destination File based on source-path, destination-path and pre-processed content.
 * @param srcDir source directory (source location of files that where Pre-Processed)
 * @param destDir destination directory (destination location where Pre-Processed files should be written)
 * @param srcFilePath source file path (the absolute path to the source file that was Pre-Prcoessed)
 * @param preProcessedContent string with content for Pre-Processed File
 */
function writePreProcessedDestFile(srcDir, destDir, srcFilePath, preProcessedContent) {
    // init file paths
    var relFilePath = srcFilePath.split(srcDir)[1];
    var destFilePath = join(destDir, relFilePath);
    // create destination directory paths
    createSubDirectories(destDir, relFilePath);
    // write processed content to destination
    writeFileSync(destFilePath, preProcessedContent);
    // include internal asset files in dest
    includeMdAssets(srcDir, destDir, relFilePath, preProcessedContent);
    console.log("Pre-Processed Destination File: " + destFilePath);
}
/**
 * Create new subdirectories beneath destination directory
 * @param destDir destination directory
 * @param relFilePath relative file path beneath destination directory
 */
function createSubDirectories(destDir, relFilePath) {
    // split into desrinations subpaths and remove empty ones
    var destPaths = relFilePath.split(sep).filter(function (subPath) { return subPath != ''; });
    if (destPaths.length > 1) {
        // at least one subdirectory found!
        var subDestDir = destDir;
        for (var _i = 0, _a = destPaths.slice(0, destPaths.length - 1); _i < _a.length; _i++) {
            var destPath = _a[_i];
            // move sub dest dir deeper
            subDestDir = join(subDestDir, destPath);
            // create non existing subdir
            createNewDirectory(subDestDir);
        }
    }
}
/**
 * Create new directory when it not already exists
 * @param newDir new directory to create
 */
function createNewDirectory(newDir) {
    if (!existsSync(newDir)) {
        // create nonexisting directory!
        mkdirSync(newDir);
        console.warn("New Directory created => " + newDir);
    }
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
    var mdContentStr = readFileSync(inputMdFilePath, 'utf-8');
    return preProcessKrokiMdContent(mdContentStr);
}
/**
 * Pre-Process a Kroki Mark Down Content String to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 *
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
function preProcessKrokiMdContent(mdContentStr) {
    var inputMdLines = mdContentStr.split('\n');
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
 * Include the Markdow assets (pictures etc. that are internal linked like ./ or ../ etc.)
 * @param srcDir source directtory of the md file
 * @param destDir destination directory for the md file
 * @param relFilePath relative path to the md file
 * @param mdContent content of the md file (with eventually links to include)
 */
function includeMdAssets(srcDir, destDir, relFilePath, mdContent) {
    var mdContentLines = mdContent.split('\n');
    var relFilePaths = relFilePath.split(sep);
    var relPath = relFilePaths.slice(0, relFilePaths.length - 1).join(sep);
    for (var _i = 0, mdContentLines_1 = mdContentLines; _i < mdContentLines_1.length; _i++) {
        var mdContentLine = mdContentLines_1[_i];
        var relAssetFilePath = extractRelAssetFilePath(relPath, mdContentLine);
        if (relAssetFilePath) {
            console.log("relAssetFilePath = " + relAssetFilePath);
            // create asset destination directory paths
            createSubDirectories(destDir, relAssetFilePath);
            // copy asset file to include
            copyFileSync(join(srcDir, relAssetFilePath), join(destDir, relAssetFilePath));
        }
    }
}
/**
 * extract relative asset file path from a Markdown content line
 * @param relPath relative path of the Markdown content file
 * @param mdContentLine Markdown content
 * @returns a relative asset file path | empty value
 */
function extractRelAssetFilePath(relPath, mdContentLine) {
    var relAssetFilePath = '';
    var assetParts = mdContentLine.split('![');
    if (assetParts.length == 2) {
        var linkParts = assetParts[1].split('](');
        if (linkParts.length == 2) {
            var assetLink = linkParts[1].split(')')[0];
            if (!(assetLink.startsWith('http://') || assetLink.startsWith('https://'))) {
                relAssetFilePath = join(relPath, assetLink);
            }
        }
    }
    return relAssetFilePath != '' ? relAssetFilePath : undefined;
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

export { createNewDirectory, createSubDirectories, encodeKrokiDiagram, extractRelAssetFilePath, includeMdAssets, listMdFilePaths, preProcessKrokiMdContent, preProcessKrokiMdFile, writePreProcessedDestFile };
