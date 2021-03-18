#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

/**
 * Node Package Modules
 */
import { argv } from 'process';
import { resolve } from 'path';

/**
 * CLI Library Modules
 */
import { listMdFilePaths, preProcessKrokiMdFile, writePreProcessedDestFile, createNewDirectory } from '../lib';

//
// START CLI Script
//

if (argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}

// get parms and initialize pre-processing
const inputDir = resolve(argv[2]);
const outputDir = resolve(argv[3]);
const mdInputeFilePaths = listMdFilePaths(inputDir);
createNewDirectory(outputDir);

// pre-process and write results
for (const mdInputeFilePath of mdInputeFilePaths) {
    console.log('='.repeat(40));
    console.log(`Pre-Processing: ${mdInputeFilePath}`);
    const preProcessedMdContent = preProcessKrokiMdFile(mdInputeFilePath);
    console.log('-'.repeat(40));
    writePreProcessedDestFile(inputDir, outputDir, mdInputeFilePath, preProcessedMdContent);
    console.log('='.repeat(40));
}
