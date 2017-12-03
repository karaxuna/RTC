export function log (...args) {
    alert(args.map(arg => {
        let err = new Error();

        if (typeof arg === 'string') {
            err.message = arg;
        }
        else {
            if (arg.stack) {
                err.stack = arg.stack;
            }

            if (arg.message) {
                err.message = arg.message;
            }

            if (arg.name) {
                err.name =  arg.name;
            }
        }

        return err;
    })
        .map(err => [err.name, err.message, err.stack].filter(data => data).join('\n'))
        .join(' '));
}
