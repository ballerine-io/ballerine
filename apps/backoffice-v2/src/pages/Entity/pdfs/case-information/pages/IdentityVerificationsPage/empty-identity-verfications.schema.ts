import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const emptyIdentityVerificationsPageSchema = BaseCaseInformationPdfSchema.extend({});
export type TEmptyIdentityVerificationsPageData = z.infer<
  typeof emptyIdentityVerificationsPageSchema
>;
