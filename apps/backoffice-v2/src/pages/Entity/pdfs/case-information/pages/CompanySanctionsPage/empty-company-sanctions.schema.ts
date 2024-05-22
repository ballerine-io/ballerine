import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const EmptyCompanySanctionsPageSchema = BaseCaseInformationPdfSchema;

export type TEmptyCompanySanctionsPageData = z.infer<typeof EmptyCompanySanctionsPageSchema>;
