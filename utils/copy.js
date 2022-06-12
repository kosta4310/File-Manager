import * as readline from 'readline';
// import { getPath } from './utils/getPath.js';
import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { rejects } from 'assert';


export let pathToFileCopy;

export async function copy(commandLineArray) {
    
        

    return await new Promise((resolve, reject) => {
       
         pathToFileCopy = path.isAbsolute(commandLineArray[0])
             ? commandLineArray[0] : path.resolve(cwd(), `${commandLineArray[0]}`);
         const fileName = path.basename(pathToFileCopy);
         
         const pathToDirectory = path.isAbsolute(commandLineArray[1])
             ? path.join(commandLineArray[1], fileName) : path.resolve(cwd(), commandLineArray[1], fileName);
        const read = fss.createReadStream(pathToFileCopy);
        const write = fss.createWriteStream(pathToDirectory, { flags: 'wx', encoding: 'utf-8' });
        read.on('error', (err) => {
            // console.error(`Operation failed: ${err.message}`);
             reject(err);
            
        })
        read
            // .on("close", () => {
            // console.log('success copy');
            // resolve();
            // })
            .pipe(write)
            .on('error', (err) => {
                reject(err);
            })
            .on('finish', () => {
                // console.log('success copy');
                resolve('success copy');
            })
            // on('error', (err) => {
            // //   console.error(`Operation failed: ${err.message}`)
            //  reject(err);
        //  });
       
    })
    
        
    
      
   
    
}