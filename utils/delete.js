
import fs, { readdir } from 'fs/promises';

import path, { resolve } from 'path';
import { chdir, cwd } from 'process';


export function rm(commandLineArray) {
    const pathToDelete = path.isAbsolute(commandLineArray.slice(1).join(' '))
                        ? commandLineArray.slice(1).join(' ')
                        : path.resolve(cwd(), `${commandLineArray.slice(1).join(' ')}`);
    return fs.rm(pathToDelete);
}