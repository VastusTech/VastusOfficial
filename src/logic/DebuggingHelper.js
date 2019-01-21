import { log } from "./Constants";

export function consoleLog(message) {
    if (log) {
        console.log(message);
    }
}
export function consoleError(message) {
    if (log) {
        console.error(message);
    }
}
