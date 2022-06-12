
import fs, { readdir } from 'fs/promises';

import path, { resolve } from 'path';
import { chdir, cwd } from 'process';


export function rm(arg) {
    const pathToDelete = path.isAbsolute(arg)
                        ? arg
                        : path.resolve(cwd(), arg);
    return fs.rm(pathToDelete);
}