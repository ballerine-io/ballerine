import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * @description Checks if a passed string is a date by checking if creating a new Date object from it returns NaN.
 * @param value
 */
export const isValidIsoDate = (value: unknown): value is string => {
  return z
    .string()
    .refine(
      (value: unknown) => {
        if (typeof value !== 'string') return false;

        const parsedDate = dayjs.utc(value, 'YYYY-MM-DDTHH:mm:ssZ', true);

        return parsedDate.isValid();
      },
      { message: 'Invalid ISO date' },
    )
    .safeParse(value).success;
};
