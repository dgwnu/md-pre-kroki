/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */

/**
 * Node Package Imports
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, sep } from 'path';
import { deflate } from 'pako';

/**
 * Local Package Imports
 */
import { mdPreKrokiConfig as config } from './md-pre-kroki-config';

/**
 * List all files that ends with .md 
 * @param mdFilePath path naar de .md files
 */
export function listMdFilePaths(mdFilePath: string) {
    let mdFiles: string[] = [];

    readdirSync(mdFilePath).forEach(file => {
        const inputFilePath = join(mdFilePath, file);

        if (statSync(inputFilePath).isDirectory()) {
            // a directory recurse to underlying directorie(s) and file(s)
            const mdDirFilePaths = listMdFilePaths(inputFilePath);
            
            for (const mdDirFilePath of mdDirFilePaths) {
                mdFiles.push(mdDirFilePath);
            }

        } else if (file.endsWith('.md')) {
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
export function writePreProcessedDestFile(srcDir: string, destDir: string, srcFilePath: string, preProcessedContent: string) {
    // init file paths
    const relFilePath = srcFilePath.split(srcDir)[1];
    const destFilePath = join(destDir, relFilePath);
    // create destination directory paths
    createSubDirectories(destDir, relFilePath);
    // write processed content to destination
    writeFileSync(destFilePath, preProcessedContent);
    // include internal asset files in dest
    includeMdAssets(srcDir, destDir, relFilePath, preProcessedContent);
    console.log(`Pre-Processed Destination File: ${destFilePath}`);
}

/**
 * Create new subdirectories beneath destination directory
 * @param destDir destination directory
 * @param relFilePath relative file path beneath destination directory
 */
export function createSubDirectories(destDir: string, relFilePath: string) {
    // split into desrinations subpaths and remove empty ones
    const destPaths = relFilePath.split(sep).filter(subPath => subPath != '');

    if ( destPaths.length > 1) {
        // at least one subdirectory found!
        let subDestDir = destDir;

        for (const destPath of destPaths.slice(0, destPaths.length - 1)) {
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
export function createNewDirectory(newDir: string) {

    if (!existsSync(newDir)) {
        // create nonexisting directory!
        mkdirSync(newDir);
        console.warn(`New Directory created => ${newDir}`);
    }

}

/**
 * Encode Diagram to make Roki Api request pay-load
 * @param diagramSource 
 * @see <https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs>
 */
export function encodeKrokiDiagram(diagramSource: string) {
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
    const mdContentStr = readFileSync(inputMdFilePath, 'utf-8');
    return preProcessKrokiMdContent(mdContentStr);
}

/**
 * Pre-Process a Kroki Mark Down Content String to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 * 
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
export function preProcessKrokiMdContent(mdContentStr: string) {
    const inputMdLines = mdContentStr.split('\n');
    let outputMdLines: string[] = [];
    let lineIndex = 0;

    while (lineIndex < inputMdLines.length) {
        console.log(`MdLine: ${inputMdLines[lineIndex]}`);

        if (isKrokiMdInline(inputMdLines[lineIndex])) {
            console.log('--> isKrokiInlne');
            const krokiApiPlugin = inputMdLines[lineIndex].split(config.mdInlne)[1].trim();
            let krokiDiagramLines: string[] = [];
            lineIndex ++;

            while (!isMdInline(inputMdLines[lineIndex])) {
                krokiDiagramLines.push(inputMdLines[lineIndex]);
                lineIndex ++;
            }

            if (krokiDiagramLines.length > 0) {
                const mdImageLine = '![kroki api]' + 
                    '(' + config.apiUrl + krokiApiPlugin + '/svg/' + 
                    encodeKrokiDiagram(krokiDiagramLines.join('\n')) + ' "kroki.io")';
                console.log(`--> mdImageLine = ${mdImageLine}`);
                outputMdLines.push(mdImageLine);
            }


        } else {
            console.log('--> basicMdInlne')
            outputMdLines.push(inputMdLines[lineIndex]);
        }

        lineIndex ++;
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
export function includeMdAssets(srcDir: string, destDir: string, relFilePath: string, mdContent: string) {
    const mdContentLines = mdContent.split('\n');
    const relFilePaths = relFilePath.split(sep);
    const relPath = relFilePaths.slice(0, relFilePaths.length - 1).join(sep);

    for (const mdContentLine of mdContentLines) {
        const relAssetFilePath = extractRelAssetFilePath(relPath, mdContentLine);

        if (relAssetFilePath) {
            console.log(`relAssetFilePath = ${relAssetFilePath}`);
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
export function extractRelAssetFilePath(relPath: string, mdContentLine: string) {
    let relAssetFilePath = '';

    const assetParts = mdContentLine.split('![');

    if (assetParts.length == 2) {

        const linkParts = assetParts[1].split('](');

        if (linkParts.length == 2) {
            const assetLink = linkParts[1].split(')')[0];

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
function isKrokiMdInline(mdLine: string) {
    return config.apiPlugins.find(krokiApi => mdLine.trim() == (config.mdInlne + krokiApi));
}

/**
 * Check for Mark Down Inline
 * @param mdLine Mark Down Line to check
 * @returns true: a Mark Down Inline, false: is not...
 */
function isMdInline(mdLine: string) {
    return mdLine.trim() == config.mdInlne;
}
