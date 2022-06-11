import os from 'os';


export function operationSystemInfo(commandLineArray) {
    switch (commandLineArray[1]) {
        case '--EOL':
            let arr = {};
            arr.EOL = os.EOL;
            return arr; 
        case '--cpus':
            let res = [];
            os.cpus().forEach(elem => {
                let obj = {};
                obj.model = elem.model;
                obj.speed = `${elem.speed / 1000}GHz`;
                res.push(obj);
            });
            return res;
        case '--homedir':
            return os.homedir();
        case '--username':
            return `Username is ${os.userInfo().username}`;
        case '--architecture':
            return `Architecture of computer is "${os.arch()}"`;
        default:
            console.error(`Operation failed`);
            break;
    }
    
}