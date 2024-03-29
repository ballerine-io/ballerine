import { safeEvery } from '@ballerine/common';

/**
 * @description Checks if an array contains all the values of another array. Works like `Array.prototype.includes` but for multiple values.
 * @param checkFor
 * @param checkIn
 */
export const includesValues = (checkFor: any[], checkIn: any[]) =>
  safeEvery(checkFor, value => checkIn.includes(value));
