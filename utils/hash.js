import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { createHash } from 'crypto';


export function calcHash(commandLineArray) {
     const pathToFile = path.isAbsolute(commandLineArray.slice(1).join(' '))
                        ? commandLineArray.slice(1).join(' ')
                        : path.resolve(cwd(), `${commandLineArray.slice(1).join(' ')}`);
    
    
        const read = fss.createReadStream(pathToFile);
        const hash = createHash('sha256');
    read
        .on('error', (err) =>  console.error(`Operation failed: ${err.message}`))
            .pipe(hash)
            .setEncoding('hex')
            .pipe(process.stdout)
            .on('error', (err) => {
                console.error(`Operation failed: ${err.message}`);
            })
    read.on('end', () => {
        process.stdout.write('\nsuccess hash\n');
    })
    
}