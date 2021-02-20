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
import { listMdFiles, preProcessKrokiMdFile } from '../lib/dgwnu-md-kroki-utils';
import { writeFileSync } from 'fs';


//
// START CLI Script
//

if (argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}

const inputDir = resolve(__dirname, '..', argv[2]);
const outputDir = resolve(__dirname, '..', argv[3]);

console.log(inputDir);
const inputMdFiles = listMdFiles(inputDir);

for (const inputMdFile of inputMdFiles) {
    console.log(inputMdFile);
    const basicMdStr = preProcessKrokiMdFile(inputMdFile);
    const outputMdFile = join(outputDir, inputMdFile.split('.kroki.md')[0] + '.md');
    console.log(outputMdFile)
    //writeFileSync(outputMdFile, basicMdStr);
}
