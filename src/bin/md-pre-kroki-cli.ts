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
import { listMdFilePaths, preProcessKrokiMdFile, writePreProcessedMdDestFile } from '../lib';

//
// START CLI Script
//

if (argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}

const inputDir = resolve(argv[2]);
const outputDir = resolve(argv[3]);

console.log(inputDir);
const mdInputeFilePaths = listMdFilePaths(inputDir);

for (const mdInputeFilePath of mdInputeFilePaths) {
    console.log('='.repeat(40));
    console.log(`Pre-Processing: ${mdInputeFilePath}`);
    const preProcessedMdContent = preProcessKrokiMdFile(mdInputeFilePath);
    console.log('-'.repeat(40));
    writePreProcessedMdDestFile(inputDir, outputDir, mdInputeFilePath, preProcessedMdContent);
    console.log('='.repeat(40));
}
