

export function getPathFromArgs(args) {
    
        if (/"|'/g.test(args)) {
            let arg = args
                .join(' ')
                .split(/["'] | ["']/)
                .map((arg) => arg.replace(/"|'/g, ''));
            return arg;
    }
    return args;
        
}