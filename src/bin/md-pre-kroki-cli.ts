#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

/**
 * Node Package Modules
 */
import { argv } from 'process';
import { resolve, join } from 'path';
import { writeFileSync } from 'fs';

/**
 * CLI Library Modules
 */
import { listMdFiles, preProcessKrokiMdFile } from '../lib';

//
// START CLI Script
//

if (argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}

const inputDir = resolve(argv[2]);
const outputDir = resolve(argv[3]);

console.log(inputDir);
const mdInputeFiles = listMdFiles(inputDir);

for (const mdInputFile of mdInputeFiles) {
    //console.log('='.repeat(40));
    console.log(`Pre-Processing: ${mdInputFile}`);
    //const preProcessedMdStr = preProcessKrokiMdFile(mdInputFile);
    //console.log('Processed Kroki Api Inline Mark Down:');
    //console.log('-'.repeat(40));
    //console.log(`${preProcessedMdStr}`);
    //console.log('-'.repeat(40));
    //const mdOutputMdFile = join(outputDir, mdInputFile);
    //console.log(`Writing To File: ${mdOutputMdFile}`)
    //writeFileSync(mdOutputMdFile, preProcessedMdStr);
    //console.log('='.repeat(40));
}
