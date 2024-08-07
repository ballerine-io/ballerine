import { z } from 'zod';
import { isType } from '@ballerine/common';

/**
 * @description Checks if a passed value is a date string.
 * @param value
 * @param isStrict - If false, will return true for strings that match the format YYYY-MM-DD.
 */
export const checkIsDate = (
  value: unknown,
  {
    isStrict = true,
  }: {
    isStrict?: boolean;
  } = {},
): value is string => {
  if (typeof value !== 'string') return false;

  if (!isStrict && /\d{4}-\d{2}-\d{2}/.test(value)) return true;

  return isType(z.string().datetime())(value);
};
