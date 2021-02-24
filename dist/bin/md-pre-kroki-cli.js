#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Node Package Modules
 */
const process_1 = require("process");
const path_1 = require("path");
/**
 * CLI Library Modules
 */
const lib_1 = require("../lib");
//
// START CLI Script
//
if (process_1.argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}
// get parms and initialize pre-processing
const inputDir = path_1.resolve(process_1.argv[2]);
const outputDir = path_1.resolve(process_1.argv[3]);
const mdInputeFilePaths = lib_1.listMdFilePaths(inputDir);
lib_1.createNewDirectory(outputDir);
// pre-process and write results
for (const mdInputeFilePath of mdInputeFilePaths) {
    console.log('='.repeat(40));
    console.log(`Pre-Processing: ${mdInputeFilePath}`);
    const preProcessedMdContent = lib_1.preProcessKrokiMdFile(mdInputeFilePath);
    console.log('-'.repeat(40));
    lib_1.writePreProcessedMdDestFile(inputDir, outputDir, mdInputeFilePath, preProcessedMdContent);
    console.log('='.repeat(40));
}
