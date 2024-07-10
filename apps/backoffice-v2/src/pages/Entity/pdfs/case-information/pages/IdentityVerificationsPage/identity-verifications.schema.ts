import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const IdentityVerificationsItemSchema = z.object({
  checkDate: z.string().optional(),
  status: z.enum(['approved', 'rejected']),
  reason: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().optional(),
  id: z.string(),
  gender: z.union([z.string(), z.null()]),
  nationality: z.union([z.string(), z.null()]),
});

export const IdentityVerificationsSchema = BaseCaseInformationPdfSchema.extend({
  items: z.array(IdentityVerificationsItemSchema),
});

export type TIdentityVerificationsItemData = z.output<typeof IdentityVerificationsItemSchema>;
export type TIdentityVerificationsData = z.output<typeof IdentityVerificationsSchema>;
