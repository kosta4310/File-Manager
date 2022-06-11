import * as readline from 'readline';
// import { getPath } from './utils/getPath.js';
import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { rejects } from 'assert';


export let pathToFileCopy;

export async function copy(commandLineArray) {
    
        

    return new Promise((resolve, reject) => {
       
         pathToFileCopy = path.isAbsolute(commandLineArray[1])
             ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
         const fileName = path.basename(pathToFileCopy);
         
         const pathToDirectory = path.isAbsolute(commandLineArray[2])
             ? path.join(commandLineArray[2], fileName) : path.resolve(cwd(), commandLineArray[2], fileName);
        const read = fss.createReadStream(pathToFileCopy);
        const write = fss.createWriteStream(pathToDirectory, { flags: 'wx', encoding: 'utf-8' });
        read.on('error', (err) => {
            console.error(`Operation failed: ${err.message}`);
             reject();
            
         })
             .pipe(write).
            on('error', (err) => {
              console.error(`Operation failed: ${err.message}`)
             reject();
            
         });
        resolve('success');
    })
    
        
    
      
   
    
}