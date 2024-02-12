import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsRecord = isType(z.record(z.string(), z.unknown()));
export const checkIsBooleanishRecord = isType(
  z.record(
    z.string(),
    z.preprocess(value => (typeof value === 'string' ? JSON.parse(value) : value), z.boolean()),
  ),
);
