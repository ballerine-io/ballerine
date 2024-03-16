import { isObject } from '@ballerine/common';

/**
 * Check if two values are equal when serialized to string
 * @param a
 * @param b
 */
export const checkIsLooselyEqualDeep = (a: any, b: any): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, index) => checkIsLooselyEqualDeep(val, b[index]));
  }

  if (isObject(a) && isObject(b)) {
    return (
      Object.keys(a).length === Object.keys(b).length &&
      Object.keys(a).every(key => checkIsLooselyEqualDeep(a[key], b[key]))
    );
  }

  return `${a}` === `${b}`;
};
