export function log (...args) {
    alert(args.map(arg => JSON.stringify(arg)).join(' '));
}
