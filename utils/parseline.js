import * as readline from 'readline';
// import { getPath } from './utils/getPath.js';
import fs, { readdir } from 'fs/promises';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { rejects } from 'assert';
// import { fs } from 'fs';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function listDir(pathToDir) {
    const dirents = await readdir(pathToDir, { withFileTypes: true });
    dirents.map(dirent => {
        console.log(dirent.name);
    })
}


export const parseLine = (userName) => {
    rl.on('line', (inputUser) => {
        let commandLineArray = inputUser.split(' ');
        if (commandLineArray.length === 1) {
             switch (inputUser) {
            case '.exit':
                rl.close();
                break;
            case 'up':
                let currentPathArray = cwd().split(path.sep);
               
                currentPathArray.splice(-1, 1);
                let newPath = currentPathArray.join(path.sep);
                newPath = currentPathArray.length === 1 ? newPath + path.sep : newPath;
               
                chdir(newPath);
                console.log(`You are in ${cwd()}`);
                break;
            case 'ls':
                fs.stat(cwd()).then(value => {
                   if (value.isDirectory()) {
                       listDir(cwd())
                           .then(() => console.log(`You are in ${cwd()}`));
                   }
               });
                break;
            default:
                console.log('Invalid input');
        }
        } else if (commandLineArray.length === 2) {
            switch (commandLineArray[0]) {
                case 'cd':
                    let newPath = path.isAbsolute(commandLineArray[1]) ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
                   try {
                     chdir(newPath);
                     console.log(`You are in ${cwd()}`);
                   } catch (err) {
                    console.error('Operation failed');
                   }
                    break;
            
                default:
                   console.log('I dont know to write here');
                    break;
            }
        }
           
        
       
        
    
    }).on('close', () => {
        console.log(`Thank you for using File Manager, ${userName}!`);
    });
}