"use strict";
/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRelAssetFilePath = exports.includeMdAssets = exports.preProcessKrokiMdContent = exports.preProcessKrokiMdFile = exports.encodeKrokiDiagram = exports.createNewDirectory = exports.createSubDirectories = exports.writePreProcessedDestFile = exports.listMdFilePaths = void 0;
/**
 * Node Package Imports
 */
const fs_1 = require("fs");
const path_1 = require("path");
const pako_1 = require("pako");
/**
 * Local Package Imports
 */
const md_pre_kroki_config_1 = require("./md-pre-kroki-config");
/**
 * List all files that ends with .md
 * @param mdFilePath path naar de .md files
 */
function listMdFilePaths(mdFilePath) {
    let mdFiles = [];
    fs_1.readdirSync(mdFilePath).forEach(file => {
        const inputFilePath = path_1.join(mdFilePath, file);
        if (fs_1.statSync(inputFilePath).isDirectory()) {
            // a directory recurse to underlying directorie(s) and file(s)
            const mdDirFilePaths = listMdFilePaths(inputFilePath);
            for (const mdDirFilePath of mdDirFilePaths) {
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
exports.listMdFilePaths = listMdFilePaths;
/**
 * Write Destination File based on source-path, destination-path and pre-processed content.
 * @param srcDir source directory (source location of files that where Pre-Processed)
 * @param destDir destination directory (destination location where Pre-Processed files should be written)
 * @param srcFilePath source file path (the absolute path to the source file that was Pre-Prcoessed)
 * @param preProcessedContent string with content for Pre-Processed File
 */
function writePreProcessedDestFile(srcDir, destDir, srcFilePath, preProcessedContent) {
    // init file paths
    const relFilePath = srcFilePath.split(srcDir)[1];
    const destFilePath = path_1.join(destDir, relFilePath);
    // create destination directory paths
    createSubDirectories(destDir, relFilePath);
    // write processed content to destination
    fs_1.writeFileSync(destFilePath, preProcessedContent);
    // include internal asset files in dest
    includeMdAssets(srcDir, destDir, relFilePath, preProcessedContent);
    console.log(`Pre-Processed Destination File: ${destFilePath}`);
}
exports.writePreProcessedDestFile = writePreProcessedDestFile;
/**
 * Create new subdirectories beneath destination directory
 * @param destDir destination directory
 * @param relFilePath relative file path beneath destination directory
 */
function createSubDirectories(destDir, relFilePath) {
    // split into desrinations subpaths and remove empty ones
    const destPaths = relFilePath.split(path_1.sep).filter(subPath => subPath != '');
    if (destPaths.length > 1) {
        // at least one subdirectory found!
        let subDestDir = destDir;
        for (const destPath of destPaths.slice(0, destPaths.length - 1)) {
            // move sub dest dir deeper
            subDestDir = path_1.join(subDestDir, destPath);
            // create non existing subdir
            createNewDirectory(subDestDir);
        }
    }
}
exports.createSubDirectories = createSubDirectories;
/**
 * Create new directory when it not already exists
 * @param newDir new directory to create
 */
function createNewDirectory(newDir) {
    if (!fs_1.existsSync(newDir)) {
        // create nonexisting directory!
        fs_1.mkdirSync(newDir);
        console.warn(`New Directory created => ${newDir}`);
    }
}
exports.createNewDirectory = createNewDirectory;
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
    const mdContentStr = fs_1.readFileSync(inputMdFilePath, 'utf-8');
    return preProcessKrokiMdContent(mdContentStr);
}
exports.preProcessKrokiMdFile = preProcessKrokiMdFile;
/**
 * Pre-Process a Kroki Mark Down Content String to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 *
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
function preProcessKrokiMdContent(mdContentStr) {
    const inputMdLines = mdContentStr.split('\n');
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
exports.preProcessKrokiMdContent = preProcessKrokiMdContent;
/**
 * Include the Markdow assets (pictures etc. that are internal linked like ./ or ../ etc.)
 * @param srcDir source directtory of the md file
 * @param destDir destination directory for the md file
 * @param relFilePath relative path to the md file
 * @param mdContent content of the md file (with eventually links to include)
 */
function includeMdAssets(srcDir, destDir, relFilePath, mdContent) {
    const mdContentLines = mdContent.split('\n');
    const relFilePaths = relFilePath.split(path_1.sep);
    const relPath = relFilePaths.slice(0, relFilePaths.length - 1).join(path_1.sep);
    for (const mdContentLine of mdContentLines) {
        const relAssetFilePath = extractRelAssetFilePath(relPath, mdContentLine);
        if (relAssetFilePath) {
            console.log(`relAssetFilePath = ${relAssetFilePath}`);
            // create asset destination directory paths
            createSubDirectories(destDir, relAssetFilePath);
            // copy asset file to include
            fs_1.copyFileSync(path_1.join(srcDir, relAssetFilePath), path_1.join(destDir, relAssetFilePath));
        }
    }
}
exports.includeMdAssets = includeMdAssets;
/**
 * extract relative asset file path from a Markdown content line
 * @param relPath relative path of the Markdown content file
 * @param mdContentLine Markdown content
 * @returns a relative asset file path | empty value
 */
function extractRelAssetFilePath(relPath, mdContentLine) {
    let relAssetFilePath = '';
    const assetParts = mdContentLine.split('![');
    if (assetParts.length == 2) {
        const linkParts = assetParts[1].split('](');
        if (linkParts.length == 2) {
            const assetLink = linkParts[1].split(')')[0];
            if (!(assetLink.startsWith('http://') || assetLink.startsWith('https://'))) {
                relAssetFilePath = path_1.join(relPath, assetLink);
            }
        }
    }
    return relAssetFilePath != '' ? relAssetFilePath : undefined;
}
exports.extractRelAssetFilePath = extractRelAssetFilePath;
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
