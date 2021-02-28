"use strict";
/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preProcessKrokiMdFile = exports.encodeKrokiDiagram = exports.createNewDirectory = exports.writePreProcessedMdDestFile = exports.listMdFilePaths = void 0;
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
 * Write Pre-Processed File based on source and destination paths.
 * @param srcDir source directory (source location of files that where Pre-Processed)
 * @param destDir destination directory (destination location where Pre-Processed files should be written)
 * @param srcFilePath source file path (the absolute path to the source file that was Pre-Prcoessed)
 * @param preProcessedContent string with content for Pre-Processed File
 */
function writePreProcessedMdDestFile(srcDir, destDir, srcFilePath, preProcessedContent) {
    const destPaths = srcFilePath.split(srcDir)[1].split(path_1.sep);
    if (destPaths.length > 2) {
        // at least one subdirectory found!
        let subDestDir = destDir;
        for (const destPath of destPaths.slice(0, destPaths.length - 1)) {
            // move sub dest dir deeper
            subDestDir = path_1.join(subDestDir, destPath);
            // create non existing subdir
            createNewDirectory(subDestDir);
        }
    }
    const destFilePath = path_1.join(destDir, destPaths.join(path_1.sep));
    fs_1.writeFileSync(destFilePath, preProcessedContent);
    console.log(`Pre-Processed Destination File: ${destFilePath}`);
}
exports.writePreProcessedMdDestFile = writePreProcessedMdDestFile;
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
