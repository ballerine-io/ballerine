export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === 'function';
