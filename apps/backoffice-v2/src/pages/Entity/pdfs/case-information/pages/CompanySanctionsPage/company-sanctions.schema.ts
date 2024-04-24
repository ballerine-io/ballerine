import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const CompanySanctionsMatchSchema = z.object({
  name: z.string(),
  reviewDate: z.date(),
  labels: z.array(z.string()),
  matchReasons: z.array(z.string()),
  sources: z.array(z.string()),
  addresses: z.array(z.string()),
});

export const CompanySanctionsSchema = BaseCaseInformationPdfSchema.extend({
  matches: z.array(CompanySanctionsMatchSchema),
});
