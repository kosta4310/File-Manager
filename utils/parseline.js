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
import { getPathFromArgs } from './pathArgs.js';



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
        const [command, ...args] = inputUser.split(' ');
        if (args.length === 0) {
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
        } else if (args.length > 0) {
            let arg = getPathFromArgs(args);
            let arg1, arg2;
            if (Array.isArray(arg) && arg.length === 1) {
                arg1 = arg[0];
            } else if (Array.isArray(arg) && arg.length === 2) {
                arg1 = arg[0];
                arg2 = arg[1];
            }
           
            switch (command) {
                case 'cd':
                    const newPath = path.isAbsolute(arg1)
                        ? arg1
                        : path.resolve(cwd(),arg1);
                   try {
                     chdir(newPath);
                     console.log(`You are in ${cwd()}`);
                   } catch (err) {
                    console.error('Operation failed');
                   }
                    break;
                case 'cat':
                    const pathToCat = path.isAbsolute(arg1)
                        ? arg1
                        : path.resolve(cwd(), arg1);
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
                    const pathToNewFile = path.resolve(cwd(), arg1);
                    fss.writeFile(pathToNewFile, '', {flag: 'wx'}, (err) => {
                        if (err) {
                            console.error(`Operation failed: ${err.message}`);
                        }
                    })
                    break;
                case 'rm':
                    
                    rm(arg1)
                        .then(() => console.log('File success delete'))
                        .catch(err => console.error(`Operation failed: ${err.message}`));
                    break;
                case 'os':
                   const res = osi.operationSystemInfo(args);
                   if (typeof res !== 'undefined') {
                        console.log(res);
                   }
                    break;
                case 'hash':
                    calcHash(arg1);
                    break;
                
                case 'rn':
                    const pathToNewFileName = path.isAbsolute(arg2)
                        ? arg2
                        : path.resolve(cwd(), arg2);
                    const pathToFileRename = path.isAbsolute(arg1)
                        ? arg1
                        : path.resolve(cwd(), arg1);
                    fs.stat(pathToFileRename).then(value => {
                        if (!value.isDirectory()) {
                            
                            fss.rename(pathToFileRename, pathToNewFileName, (err) => {
                                if (err) {
                                    console.error(`Operation failed: ${err.message}`);
                                }
                            })
                        } else console.error(`Operation failed: ${pathToFileRename} is not file`);
                    }).catch((err) => console.error(`Operation failed: ${err.message}`));
                    
                    break;
                case 'cp':
                    copy(arg)
                        .then(msg => console.log(msg))
                        .catch((err) => console.error(`Operation failed: ${err.message}`));
                    break;
                case 'mv':
                    move(arg);
                    break;
                case 'compress':
                    compress(arg)
                        .then(() => { console.log('success compress') })
                        .catch(err => console.error(`Operation failed: ${err.message}`));
                    break;
                case 'decompress':
                    decompress(arg)
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