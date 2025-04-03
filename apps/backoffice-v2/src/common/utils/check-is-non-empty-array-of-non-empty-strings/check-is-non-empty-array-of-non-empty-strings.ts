import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsNonEmptyArrayOfNonEmptyStrings = (value: unknown) =>
  isType(z.array(z.string().min(1)))(value);
