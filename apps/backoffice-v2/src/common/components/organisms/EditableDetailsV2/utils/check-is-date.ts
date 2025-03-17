import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsDate = (value: unknown): value is string => {
  return isType(z.string().date())(value);
};
