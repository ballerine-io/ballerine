export const isFunction = (value: unknown): value is (...args: Array<unknown>) => unknown =>
  typeof value === 'function';
