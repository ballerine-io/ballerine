import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const CompanyOwnershipItem = z.object({
  companyName: z.string(),
  companyType: z.string(),
  ownershipPercentage: z.number(),
  level: z.number(),
});

export const CompanyOwnershipSchema = BaseCaseInformationPdfSchema.extend({
  companies: z.array(CompanyOwnershipItem),
});
