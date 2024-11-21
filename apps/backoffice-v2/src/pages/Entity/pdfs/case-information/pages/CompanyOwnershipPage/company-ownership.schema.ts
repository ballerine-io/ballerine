import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const CompanyOwnershipItem = z.object({
  companyName: z.string(),
  companyType: z.string(),
  ownershipPercentage: z.string().optional(),
  level: z.string().optional(),
});

export const CompanyOwnershipSchema = BaseCaseInformationPdfSchema.extend({
  items: z.array(CompanyOwnershipItem),
});

export type TCompanyOwnershipData = z.infer<typeof CompanyOwnershipSchema>;
