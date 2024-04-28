import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const registryInformationSchema = BaseCaseInformationPdfSchema.extend({
  companyName: z.string(),
  registrationNumber: z.string(),
  incorporationDate: z.string(),
  companyType: z.string(),
  companyStatus: z.string().optional(),
  lastUpdate: z.date(),
  registeredAt: z.string(),
  registrationAddress: z.string(),
  registryPage: z.string(),
});

export type TRegistryInformationData = z.infer<typeof registryInformationSchema>;
