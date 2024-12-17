import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsDatetime = (value: unknown): value is string => {
  return isType(z.string().datetime())(value);
};
