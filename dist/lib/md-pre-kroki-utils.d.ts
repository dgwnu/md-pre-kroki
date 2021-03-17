/**
 * DGWNU Utils to Pre-Process Mark Down with Kroki Diagram Apis
 */
/**
 * List all files that ends with .md
 * @param mdFilePath path naar de .md files
 */
export declare function listMdFilePaths(mdFilePath: string): string[];
/**
 * Write Pre-Processed File based on source and destination paths.
 * @param srcDir source directory (source location of files that where Pre-Processed)
 * @param destDir destination directory (destination location where Pre-Processed files should be written)
 * @param srcFilePath source file path (the absolute path to the source file that was Pre-Prcoessed)
 * @param preProcessedContent string with content for Pre-Processed File
 */
export declare function writePreProcessedMdDestFile(srcDir: string, destDir: string, srcFilePath: string, preProcessedContent: string): void;
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
