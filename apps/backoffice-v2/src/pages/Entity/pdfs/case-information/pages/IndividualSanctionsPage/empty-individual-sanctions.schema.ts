import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const emptyIndividualSanctionsPageSchema = BaseCaseInformationPdfSchema
export type TEmptyIndividualSanctionsPageData = z.infer<typeof emptyIndividualSanctionsPageSchema>;
