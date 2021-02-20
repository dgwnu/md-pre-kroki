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
const dgwnu_md_kroki_utils_1 = require("../lib/dgwnu-md-kroki-utils");
//
// START CLI Script
//
if (process_1.argv.length != 4) {
    console.error('2 parms required (inputDir outputDir)');
}
const inputDir = path_1.resolve(__dirname, '..', process_1.argv[2]);
const outputDir = path_1.resolve(__dirname, '..', process_1.argv[3]);
console.log(inputDir);
const inputMdFiles = dgwnu_md_kroki_utils_1.listMdFiles(inputDir);
for (const inputMdFile of inputMdFiles) {
    console.log(inputMdFile);
    const basicMdStr = dgwnu_md_kroki_utils_1.preProcessKrokiMdFile(path_1.join(inputDir, inputMdFile));
    console.log(basicMdStr);
    const outputMdFile = path_1.join(outputDir, inputMdFile.split('.kroki.md')[0] + '.md');
    console.log(outputMdFile);
    fs_1.writeFileSync(outputMdFile, basicMdStr);
}