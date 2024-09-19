import { z } from 'zod';

const ActiveMonitoringSchema = z.object({
  type: z.literal('aml'),
  vendor: z.enum(['veriff', 'test', 'dow-jones']),
  monitoredUntil: z.string().datetime(),
  sessionId: z.string(),
});

export const EndUserActiveMonitoringsSchema = z.array(ActiveMonitoringSchema);

const SourceSchema = z.object({
  type: z.string().nullable().optional(),
  sourceName: z.string().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  date: z.string().nullable().optional(),
});

const AmlHitSchema = z.object({
  vendor: z.enum(['veriff', 'test', 'dow-jones']),
  matchedName: z.string(),
  countries: z.array(z.string()),
  matchTypes: z.array(z.string()),
  warnings: z.array(SourceSchema),
  sanctions: z.array(SourceSchema),
  fitnessProbity: z.array(SourceSchema),
  pep: z.array(SourceSchema),
  adverseMedia: z.array(SourceSchema),
  other: z.array(SourceSchema).optional(),
});

export const EndUserAmlHitsSchema = z.array(AmlHitSchema);
