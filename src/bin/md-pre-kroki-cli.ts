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
const mdFiles = listMdFiles(inputDir);

for (const mdFile of mdFiles) {
    const inputMdFile = join(inputDir, mdFile);
    console.log('='.repeat(40));
    console.log(`Pre-Processing: ${inputMdFile}`);
    const basicMdStr = preProcessKrokiMdFile(inputMdFile);
    console.log('Processed Kroki Api Inline Mark Down:');
    console.log('-'.repeat(40));
    console.log(`${basicMdStr}`);
    console.log('-'.repeat(40));
    const outputMdFile = join(outputDir, mdFile);
    console.log(`Writing To File: ${outputMdFile}`)
    writeFileSync(outputMdFile, basicMdStr);
    console.log('='.repeat(40));
}
