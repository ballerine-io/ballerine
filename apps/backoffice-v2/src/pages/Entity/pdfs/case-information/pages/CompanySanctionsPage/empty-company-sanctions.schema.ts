import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const emptyCompanySanctionsPageSchema = BaseCaseInformationPdfSchema.extend({});

export type TEmptyCompanySanctionsPageData = z.infer<typeof emptyCompanySanctionsPageSchema>;
