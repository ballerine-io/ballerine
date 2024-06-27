import { z } from 'zod';

const SourceInfoSchema = z
  .object({
    type: z.string().optional().nullable(),
    sourceName: z.string().optional().nullable(),
    sourceUrl: z.string().optional().nullable(),
    date: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

export const HitSchema = z.object({
  matchedName: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  countries: z.array(z.string()).optional().nullable(),
  matchTypes: z.array(z.string()).optional().nullable(),
  aka: z.array(z.string()).optional().nullable(),
  warnings: z.array(SourceInfoSchema).optional().nullable(),
  sanctions: z.array(SourceInfoSchema).optional().nullable(),
  pep: z.array(SourceInfoSchema).optional().nullable(),
  adverseMedia: z.array(SourceInfoSchema).optional().nullable(),
  fitnessProbity: z.array(SourceInfoSchema).optional().nullable(),
  other: z.array(SourceInfoSchema).optional().nullable(),
});

export type THit = z.infer<typeof HitSchema>;

export const AmlSchema = z.object({
  hits: z.array(HitSchema).optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export type TAml = z.infer<typeof AmlSchema>;

const calculateEntry = (sourceInfo: z.infer<typeof SourceInfoSchema>) => {
  return {
    date: sourceInfo?.date,
    sourceName: [sourceInfo?.sourceName, sourceInfo?.type].filter(Boolean).join(' - '),
    sourceUrl: sourceInfo?.sourceUrl,
  };
};

export const amlAdapter = (aml: TAml) => {
  const { hits, createdAt } = aml;

  return {
    totalMatches: hits?.length ?? 0,
    fullReport: aml,
    dateOfCheck: createdAt,
    matches:
      hits?.map(
        ({
          matchedName,
          dateOfBirth,
          countries,
          matchTypes,
          aka,
          sanctions,
          warnings,
          pep,
          adverseMedia,
          fitnessProbity,
          other,
        }) => ({
          matchedName,
          dateOfBirth,
          countries: countries?.join(', ') ?? '',
          matchTypes: matchTypes?.join(', ') ?? '',
          aka: aka?.join(', ') ?? '',
          sanctions: sanctions?.filter(Boolean).map(item => calculateEntry(item)) ?? [],
          warnings: warnings?.filter(Boolean).map(item => calculateEntry(item)) ?? [],
          pep: pep?.filter(Boolean).map(item => calculateEntry(item)) ?? [],
          adverseMedia: adverseMedia?.filter(Boolean).map(item => calculateEntry(item)) ?? [],
          fitnessProbity: fitnessProbity?.filter(Boolean).map(item => calculateEntry(item)) ?? [],
          other: other?.filter(Boolean).map(item => calculateEntry(item)) ?? [],
        }),
      ) ?? [],
  };
};
