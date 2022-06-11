import fs, { readdir } from 'fs/promises';
import fss from 'fs';
import path, { resolve } from 'path';
import { chdir, cwd } from 'process';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
const pipePromisify = promisify(pipeline);

// path_to_destination - путь к папке назначения
export async function compress(commandLineArray) {
    const pathToDirectory = path.isAbsolute(commandLineArray[2])
        ? commandLineArray[2] : path.resolve(cwd(), `${commandLineArray[2]}`);
    const pathToFile = path.isAbsolute(commandLineArray[1])
        ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
    
    const baseName = path.basename(pathToFile);
    

    const read = fss.createReadStream(pathToFile);
    const brotli = createBrotliCompress();
    const dest = fss.createWriteStream(path.resolve(pathToDirectory, `${baseName}.br`));
    await pipePromisify(
        read,
        brotli,
        dest
    )
}
export async function decompress(commandLineArray) {
    const pathToDirectory = path.isAbsolute(commandLineArray[2])
        ? commandLineArray[2] : path.resolve(cwd(), `${commandLineArray[2]}`);
    const pathToFile = path.isAbsolute(commandLineArray[1])
        ? commandLineArray[1] : path.resolve(cwd(), `${commandLineArray[1]}`);
    
    const baseName = path.basename(pathToFile);
    const ext = path.extname(pathToFile);
    const fileName = baseName.replace(ext, "");

    const read = fss.createReadStream(pathToFile);
    const brotli = createBrotliDecompress();
    const dest = fss.createWriteStream(path.resolve(pathToDirectory, fileName));
    return await pipePromisify(
        read,
        brotli,
        dest
    )
}