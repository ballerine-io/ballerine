import { isType } from '../is-type';
import { z } from 'zod';

export const checkIsNonEmptyArrayOfNonEmptyStrings = (value: unknown) =>
  isType(z.array(z.string().min(1)).min(1))(value);
