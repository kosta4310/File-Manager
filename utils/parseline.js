import * as readline from 'readline';
// import { getPath } from './utils/getPath.js';
import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { rejects } from 'assert';



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
                    const newPath = path.isAbsolute(commandLineArray[1]) ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
                   try {
                     chdir(newPath);
                     console.log(`You are in ${cwd()}`);
                   } catch (err) {
                    console.error('Operation failed');
                   }
                    break;
                case 'cat':
                    const pathToCat = path.isAbsolute(commandLineArray[1]) ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
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
                    const pathToNewFile = path.resolve(cwd(), `${commandLineArray[1]}`);
                    fss.writeFile(pathToNewFile, '', {flag: 'wx'}, (err) => {
                        if (err) {
                            console.error(`Operation failed: ${err.message}`);
                        }
                    })
                    break;
                default:
                   console.log('Invalid input');
                    break;
            }
        } else if (commandLineArray.length === 3) {
            switch (commandLineArray[0]) {
                case 'rn':
                    const newFileName = commandLineArray[2];
                    const pathToFileRename = path.isAbsolute(commandLineArray[1]) ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
                    fs.stat(pathToFileRename).then(value => {
                        if (!value.isDirectory()) {
                           
                              fss.rename(pathToFileRename, newFileName, (err) => {
                        if (err) {
                             console.error(`Operation failed: ${err.message}`);
                        }
                    })
                          
                        }else console.error(`Operation failed: ${pathToFileRename} is not file`);
                    }).catch((err)=> console.error(`Operation failed: ${err.message}`));
                    // fss.rename(pathToFileRename, newFileName, (err) => {
                    //     if (err) {
                    //          console.error(`Operation failed: ${err.message}`);
                    //     }
                    // })
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