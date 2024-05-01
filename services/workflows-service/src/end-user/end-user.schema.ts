import { z } from 'zod';

const ActiveMonitoringSchema = z.object({
  type: z.literal('aml'),
  vendor: z.literal('veriff'),
  monitoredUntil: z.string().datetime(),
  sessionId: z.string(),
});

export const EndUserActiveMonitoringsSchema = z.array(ActiveMonitoringSchema);

const SourceSchema = z.object({
  sourceName: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  date: z.string().nullable().optional(),
});

const AmlHitSchema = z.object({
  vendor: z.literal('veriff'),
  matchedName: z.string(),
  countries: z.array(z.string()),
  matchTypes: z.array(z.string()),
  listingsRelatedToMatch: z.object({
    warnings: z.array(SourceSchema),
    sanctions: z.array(SourceSchema),
    fitnessProbity: z.array(SourceSchema),
    pep: z.array(SourceSchema),
    adverseMedia: z.array(SourceSchema),
  }),
});

export const EndUserAmlHitsSchema = z.array(AmlHitSchema);
