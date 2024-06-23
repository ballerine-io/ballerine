import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const CompanySanctionSchema = z.object({
  name: z.string(),
  reviewDate: z.string().optional(),
  labels: z.array(z.string()),
  matchReasons: z.array(z.string()),
  sources: z.array(z.string()),
  addresses: z.array(z.object({ country: z.string(), city: z.string(), address: z.string() })),
});

export const CompanySanctionsSchema = BaseCaseInformationPdfSchema.extend({
  sanctions: z.array(CompanySanctionSchema),
});

export type TCompanySanctionsData = z.infer<typeof CompanySanctionsSchema>;
