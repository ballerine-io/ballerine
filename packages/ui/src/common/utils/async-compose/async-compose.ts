export const asyncCompose = <T>(...fns: Array<(arg: T) => Promise<T> | T>) => {
  return async (initialValue: T): Promise<T> => {
    return fns.reduceRight(async (promise: Promise<T>, fn) => {
      const value = await promise;

      return Promise.resolve(fn(value));
    }, Promise.resolve(initialValue));
  };
};
