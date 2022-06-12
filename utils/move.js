import * as readline from 'readline';
// import { getPath } from './utils/getPath.js';
import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { copy, pathToFileCopy } from './copy.js';
import { rejects } from 'assert';

export function move(commandLineArray) {

        // copy(commandLineArray)
        //     .then(() => {
    
        //         fs.rm(pathToFileCopy);
        //     }).catch((err) => console.error(`Operation failed: ${err.message}`));
       


}