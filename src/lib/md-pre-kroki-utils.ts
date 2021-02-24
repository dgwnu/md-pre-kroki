/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */

/**
 * Node Package Imports
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
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
 * Write Pre-Processed Destination File based on source and destination paths.
 * @param srcDir source directory (source location of files that where Pre-Processed)
 * @param destDir destination directory (destination location where Pre-Processed files should be written)
 * @param srcFilePath source file path (the absolute path to the source file that was Pre-Prcoessed)
 */
export function writeDestFile(srcDir: string, destDir: string, srcFilePath: string) {
    const destPaths = srcFilePath.split(srcDir)[1].split(sep);

    if ( destPaths.length > 2) {
        // at least one subdirectory found!
        let subDirPath = '';

        for (const destPath of destPaths.slice(1, destPaths.length - 1)) {
                subDirPath = join(subDirPath, destPath);
                console.log(`destPath = ${subDirPath}`);
        }

    }
    //console.log(`Writing To File: ${mdOutputMdFilePath}`)
    //writeFileSync(mdOutputMdFilePath, preProcessedMdStr);
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
    const inputMdLines = readFileSync(inputMdFilePath, 'utf-8').split('\n');
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
