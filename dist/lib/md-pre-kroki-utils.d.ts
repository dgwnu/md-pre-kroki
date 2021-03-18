/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */
/**
 * List all files that ends with .md
 * @param mdFilePath path naar de .md files
 */
export declare function listMdFilePaths(mdFilePath: string): string[];
/**
 * Write Destination File based on source-path, destination-path and pre-processed content.
 * @param srcDir source directory (source location of files that where Pre-Processed)
 * @param destDir destination directory (destination location where Pre-Processed files should be written)
 * @param srcFilePath source file path (the absolute path to the source file that was Pre-Prcoessed)
 * @param preProcessedContent string with content for Pre-Processed File
 */
export declare function writePreProcessedDestFile(srcDir: string, destDir: string, srcFilePath: string, preProcessedContent: string): void;
/**
 * Create new subdirectories beneath destination directory
 * @param destDir destination directory
 * @param relFilePath relative file path beneath destination directory
 */
export declare function createSubDirectories(destDir: string, relFilePath: string): void;
/**
 * Create new directory when it not already exists
 * @param newDir new directory to create
 */
export declare function createNewDirectory(newDir: string): void;
/**
 * Encode Diagram to make Roki Api request pay-load
 * @param diagramSource
 * @see <https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs>
 */
export declare function encodeKrokiDiagram(diagramSource: string): string;
/**
 * Pre-Process a Kroki Mark Down File to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 *
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
export declare function preProcessKrokiMdFile(inputMdFilePath: string): string;
/**
 * Pre-Process a Kroki Mark Down Content String to basic Mark Down format string
 * @param inputMdFilePath Absolute Kroki Mark Down File Path to Pre-Process
 *
 * @returns Basic Mard Down format String with Kroki Inline(s) converted to Kroki Api References(s)
 */
export declare function preProcessKrokiMdContent(mdContentStr: string): string;
/**
 * Include the Markdow assets (pictures etc. that are internal linked like ./ or ../ etc.)
 * @param srcDir source directtory of the md file
 * @param destDir destination directory for the md file
 * @param relFilePath relative path to the md file
 * @param mdContent content of the md file (with eventually links to include)
 */
export declare function includeMdAssets(srcDir: string, destDir: string, relFilePath: string, mdContent: string): void;
/**
 * extract relative asset file path from a Markdown content line
 * @param relPath relative path of the Markdown content file
 * @param mdContentLine Markdown content
 * @returns a relative asset file path | empty value
 */
export declare function extractRelAssetFilePath(relPath: string, mdContentLine: string): string | undefined;
