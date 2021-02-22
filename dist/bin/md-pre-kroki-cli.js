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
const fs_1 = require("fs");
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
const inputDir = path_1.resolve(process_1.argv[2]);
const outputDir = path_1.resolve(process_1.argv[3]);
console.log(inputDir);
const mdFiles = lib_1.listMdFiles(inputDir);
for (const mdFile of mdFiles) {
    const inputMdFile = path_1.join(inputDir, mdFile);
    console.log('='.repeat(40));
    console.log(`Pre-Processing: ${inputMdFile}`);
    const basicMdStr = lib_1.preProcessKrokiMdFile(inputMdFile);
    console.log('Processed Kroki Api Inline Mark Down:');
    console.log('-'.repeat(40));
    console.log(`${basicMdStr}`);
    console.log('-'.repeat(40));
    const outputMdFile = path_1.join(outputDir, mdFile);
    console.log(`Writing To File: ${outputMdFile}`);
    fs_1.writeFileSync(outputMdFile, basicMdStr);
    console.log('='.repeat(40));
}
