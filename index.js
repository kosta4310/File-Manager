import * as readline from 'readline';
import { getPath } from './utils/getPath.js';
import os from 'os';

import { parseLine } from './utils/parseline.js';
import path from 'path';

import { spawn } from 'child_process';



const args = process.argv.slice(2);
const userName = args[0].split('=').slice(1);

console.log(`Welcome to the File Manager, ${userName}`);


process.chdir(os.homedir());
console.log(`You are in ${os.homedir()}`);
parseLine(userName);
