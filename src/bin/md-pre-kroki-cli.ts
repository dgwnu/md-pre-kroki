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
import { 
    listMdFiles
} from '../lib/dgwnu-md-kroki-utils';


//
// START CLI Script
//

if (argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}

const inputDir = argv[2];
const outputDir = argv[3];

const inputMdFiles = listMdFiles(resolve(__dirname, outputDir));

for (const inputMdFile of inputMdFiles) {
    console.log(inputMdFile);
}