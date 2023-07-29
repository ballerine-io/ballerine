/**
 * Log to console if condition is true
 * @param condition
 * @param args
 */
export const log = (condition: boolean, ...args: Array<any>) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  condition && console.log(...args);
