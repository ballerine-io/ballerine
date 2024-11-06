import { z } from 'zod';

export const ParsedBooleanSchema = z.preprocess(
  value => (typeof value === 'string' ? JSON.parse(value) : value),
  z.boolean(),
);

export const BooleanishRecordSchema = z.record(z.string(), ParsedBooleanSchema);
