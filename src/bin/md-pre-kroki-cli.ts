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
import { listMdFilePaths, preProcessKrokiMdFile, writeDestFile } from '../lib';

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
    const preProcessedMdStr = preProcessKrokiMdFile(mdInputeFilePath);
    console.log('Processed Kroki Api Inline Mark Down:');
    console.log('-'.repeat(40));
    console.log(`${preProcessedMdStr}`);
    console.log('-'.repeat(40));
    writeDestFile(inputDir, outputDir, mdInputeFilePath);
    console.log('='.repeat(40));
}
