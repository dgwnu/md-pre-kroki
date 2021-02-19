#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

/**
 * Node Package Modules
 */
import { argv } from 'process';
import { inspect } from 'util';
import { Observable, throwError } from 'rxjs';
import * as Colors from 'colors';

/**
 * CLI Library Modules
 */
import { 
} from '../lib/dgwnu-md-kroki-utils';

/**
 * colors constant that is used for console.log()
 * Based on <https://www.voidcanvas.com/make-console-log-output-colorful-and-stylish-in-browser-node/>
 */
const colors = Colors;

//
// START CLI Script
//
const command = argv[2];
let parms: string[] = [];

if (argv[3]) {
    parms.push(argv[3]);
}

if (argv[4]) {
    parms.push(argv[4]);
}

console.log(`DGWNU - Fuseki CLI - ${command} ${parms}`.bgRed.yellow.bold);

