import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsUnknownRecord = isType(z.record(z.string(), z.unknown()));
export const checkIsAnyRecord = isType(z.record(z.string(), z.any()));
export const checkIsBooleanishRecord = isType(
  z.record(
    z.string(),
    z.preprocess(value => (typeof value === 'string' ? JSON.parse(value) : value), z.boolean()),
  ),
);
