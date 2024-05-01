import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const emptyCompanyOwnershipPageSchema = BaseCaseInformationPdfSchema.extend({});

export type TEmptyCompanyOwnershipPageeData = z.infer<typeof emptyCompanyOwnershipPageSchema>;
