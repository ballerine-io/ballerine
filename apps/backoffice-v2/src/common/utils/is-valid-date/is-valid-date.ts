import { z } from 'zod';

/**
 * @description Checks if a passed string is a date by checking if creating a new Date object from it returns NaN.
 * @param value
 */
export const isValidDate = (value: unknown): value is string => {
  return z.string().datetime().safeParse(value).success;
};
