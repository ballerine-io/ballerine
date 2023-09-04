import { z } from 'zod';

/**
 * @description Checks if a passed string is a URL string.
 * @param value
 */
export const isValidUrl = (value: unknown): value is string => {
  return z.string().url().safeParse(value).success;
};
