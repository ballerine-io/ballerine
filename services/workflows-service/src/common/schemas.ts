import z from 'zod';

export const PropertyKeySchema = z.union([z.string(), z.number(), z.symbol()]);

export const RecordAnySchema = z.record(PropertyKeySchema, z.any());

export const RecordUnknownSchema = z.record(PropertyKeySchema, z.any());

export const InputJsonValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.any()),
  RecordAnySchema,
]);
export const JsonValueSchema = z.union([InputJsonValueSchema, z.null()]);
