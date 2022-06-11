import * as readline from 'readline';

import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';

import { copy } from './copy.js';
import { move } from './move.js';
import { rm } from './delete.js';
import * as osi from './osi.js';
import { calcHash } from './hash.js';
import { compress, decompress } from './compressAndDecompress.js';



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
                           .then(() => console.log(`You are in ${cwd()}`))
                           .catch(err => console.error(`Operation failed: ${err.message}`));
                   }
               });
                break;
            default:
                console.log('Invalid input');
        }
        } else if (commandLineArray.length > 1) {
            switch (commandLineArray[0]) {
                case 'cd':
                    
                    // const newPath = path.isAbsolute(commandLineArray[1]) ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
                    const newPath = path.isAbsolute(commandLineArray.slice(1).join(' '))
                        ? commandLineArray.slice(1).join(' ')
                        : path.resolve(cwd(), `${commandLineArray.slice(1).join(' ')}`);
                   try {
                     chdir(newPath);
                     console.log(`You are in ${cwd()}`);
                   } catch (err) {
                    console.error('Operation failed');
                   }
                    break;
                case 'cat':
                    // const pathToCat = path.isAbsolute(commandLineArray[1]) ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
                    const pathToCat = path.isAbsolute(commandLineArray.slice(1).join(' '))
                        ? commandLineArray.slice(1).join(' ')
                        : path.resolve(cwd(), `${commandLineArray.slice(1).join(' ')}`);
                    fs.stat(pathToCat).then(value => {
                        if (!value.isDirectory()) {
                           try {
                             const read = fss.createReadStream(pathToCat);
                               read.on('error', (err) => console.error(`Operation failed: ${err.message}`)).pipe(process.stdout);
                           } catch (err) {
                            console.error(`Operation failed: ${err.message}`);
                           }
                        }else console.error(`Operation failed: ${err.message}`);
                    }).catch((err)=> console.error(`Operation failed: ${err.message}`));                   
                   
                    break;
                case 'add':
                    const pathToNewFile = path.resolve(cwd(), `${commandLineArray.slice(1).join(' ')}`);
                    fss.writeFile(pathToNewFile, '', {flag: 'wx'}, (err) => {
                        if (err) {
                            console.error(`Operation failed: ${err.message}`);
                        }
                    })
                    break;
                case 'rm':
                    // const pathToDelete = path.isAbsolute(commandLineArray.slice(1).join(' '))
                    //     ? commandLineArray.slice(1).join(' ')
                    //     : path.resolve(cwd(), `${commandLineArray.slice(1).join(' ')}`);
                    // fs.rm(pathToDelete)
                    rm(commandLineArray)
                        .then(() => console.log('File success delete'))
                        .catch(err => console.error(`Operation failed: ${err.message}`));
                    break;
                case 'os':
                   const res = osi.operationSystemInfo(commandLineArray);
                   if (typeof res !== 'undefined') {
                        console.log(res);
                   }
                    break;
                case 'hash':
                    calcHash(commandLineArray);
                    break;
                // default:
                //    console.log('Invalid input');
                //     break;
            // }
        // } else if (commandLineArray.length === 3) {
        //     switch (commandLineArray[0]) {
                case 'rn':
                    const newFileName = commandLineArray[2];
                    const pathToFileRename = path.isAbsolute(commandLineArray[1])
                        ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
                    fs.stat(pathToFileRename).then(value => {
                        if (!value.isDirectory()) {
                            fss.rename(pathToFileRename, newFileName, (err) => {
                                if (err) {
                                    console.error(`Operation failed: ${err.message}`);
                                }
                            })
                        } else console.error(`Operation failed: ${pathToFileRename} is not file`);
                    }).catch((err) => console.error(`Operation failed: ${err.message}`));
                    
                    break;
                case 'cp':
                    copy(commandLineArray)
                        .catch((err) => console.error(`I catch error ${err}`));
                    break;
                case 'mv':
                    move(commandLineArray);
                    break;
                case 'compress':
                    compress(commandLineArray)
                        .then(() => { console.log('success compress') })
                        .catch(err => console.error(`Operation failed: ${err.message}`));
                    break;
                case 'decompress':
                    decompress(commandLineArray)
                        .then(() => console.log('success decompress'))
                        .catch(err => console.error(`Operation failed: ${err.message}`));
                    break;
                default:
                    console.log('Invalid input');
                    break;
            }
        } else {
            console.error('Invalid input');
        }
           
        
       
        
    
    }).on('close', () => {
        console.log(`Thank you for using File Manager, ${userName}!`);
    });
}