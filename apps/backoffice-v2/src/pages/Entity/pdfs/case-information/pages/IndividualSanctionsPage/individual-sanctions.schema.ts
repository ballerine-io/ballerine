import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const IndividualSanctionsItem = z.object({
  checkDate: z.string().optional(),
  fullName: z.string(),
  matchesCount: z.number(),
  names: z.array(z.string()),
  warnings: z.array(z.object({ sourceUrl: z.string(), name: z.string() })),
  sanctions: z.array(z.object({ sourceUrl: z.string(), name: z.string() })),
  PEP: z.array(z.object({ sourceUrl: z.string(), name: z.string() })),
  adverseMedia: z.array(z.object({ sourceUrl: z.string(), name: z.string() })),
});

export const IndividualSanctionsSchema = BaseCaseInformationPdfSchema.extend({
  items: z.array(IndividualSanctionsItem),
});

export type TIndividualSanctionsItemData = z.output<typeof IndividualSanctionsItem>;
export type TIndividualSanctionsData = z.output<typeof IndividualSanctionsSchema>;
