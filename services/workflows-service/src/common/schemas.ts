import z from 'zod';

import { URL_PATTERN } from '@ballerine/common';

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

export const BusinessReportRequestSchema = z.object({
  websiteUrl: z.string().regex(URL_PATTERN, { message: 'Invalid URL' }),
  countryCode: z.string().length(2).optional(),
  lineOfBusiness: z.string().optional(),
  parentCompanyName: z.string().optional(),
  merchantName: z.string().optional(),
  correlationId: z.string().optional(),
});

export type TBusinessReportRequest = z.infer<typeof BusinessReportRequestSchema>;
