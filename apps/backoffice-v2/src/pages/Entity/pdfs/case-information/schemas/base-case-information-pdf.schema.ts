import { z } from 'zod';

export const BaseCaseInformationPdfSchema = z.object({
  companyName: z.string(),
  creationDate: z.date(),
  logoUrl: z.string(),
});
