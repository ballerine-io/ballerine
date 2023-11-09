/**
 * @description Checks if an array contains all the values of another array. Works like `Array.prototype.includes` but for multiple values.
 * @param checkFor
 * @param checkIn
 */
export const includesValues = (checkFor: Array<any>, checkIn: Array<any>) =>
  checkFor.every(value => checkIn.includes(value));
