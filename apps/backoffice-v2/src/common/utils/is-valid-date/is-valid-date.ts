import { z } from 'zod';

/**
 * @description Checks if a passed string is a date by checking if creating a new Date object from it returns NaN.
 * @param str
 */
export const isValidDate = (str: string) => {
  return z.string().datetime().safeParse(str).success;
};
