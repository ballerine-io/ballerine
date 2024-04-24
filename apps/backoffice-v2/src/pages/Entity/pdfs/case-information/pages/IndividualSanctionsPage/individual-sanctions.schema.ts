import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const IndividualSanctionsItem = z.object({
  checkDate: z.date(),
  matchesCount: z.number(),
  names: z.array(z.string()),
  warnings: z.array(z.string()),
  sanctions: z.array(z.string()),
  PEP: z.array(z.string()),
  adverseMedia: z.array(z.string()),
});

export const IndividualSanctionsSchema = BaseCaseInformationPdfSchema.extend({});
