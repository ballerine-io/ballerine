import { z } from 'zod';

const SourceInfoSchema = z
  .object({
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
});

export type THit = z.infer<typeof HitSchema>;

export const AmlSchema = z.object({
  hits: z.array(HitSchema).optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export type TAml = z.infer<typeof AmlSchema>;

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
        }) => ({
          matchedName,
          dateOfBirth,
          countries: countries?.join(', ') ?? '',
          matchTypes: matchTypes?.join(', ') ?? '',
          aka: aka?.join(', ') ?? '',
          sanctions:
            sanctions?.filter(Boolean).map(sanction => ({
              sanction: sanction?.sourceName,
              date: sanction?.date,
              source: sanction?.sourceUrl,
            })) ?? [],
          warnings:
            warnings?.filter(Boolean).map(warning => ({
              warning: warning?.sourceName,
              date: warning?.date,
              source: warning?.sourceUrl,
            })) ?? [],
          pep:
            pep?.filter(Boolean).map(pepItem => ({
              person: pepItem?.sourceName,
              date: pepItem?.date,
              source: pepItem?.sourceUrl,
            })) ?? [],
          adverseMedia:
            adverseMedia?.filter(Boolean).map(adverseMediaItem => ({
              entry: adverseMediaItem?.sourceName,
              date: adverseMediaItem?.date,
              source: adverseMediaItem?.sourceUrl,
            })) ?? [],
          fitnessProbity:
            fitnessProbity?.filter(Boolean).map(fitnessProbityItem => ({
              entry: fitnessProbityItem?.sourceName,
              date: fitnessProbityItem?.date,
              source: fitnessProbityItem?.sourceUrl,
            })) ?? [],
        }),
      ) ?? [],
  };
};
