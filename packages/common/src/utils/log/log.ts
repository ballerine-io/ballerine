/**
 * Log to console if condition is true
 * @param condition
 * @param args
 */
export const log = (condition: boolean, ...args: Array<any>) => condition && console.log(...args);
