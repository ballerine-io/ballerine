import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const IdentityVerificationsItemSchema = z.object({
  checkDate: z.date(),
  result: z.string(),
  reason: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  id: z.string(),
  gender: z.string(),
  nationality: z.string(),
});

export const IdentityVerificationsSchema = BaseCaseInformationPdfSchema.extend({
  items: z.array(IdentityVerificationsItemSchema),
});
