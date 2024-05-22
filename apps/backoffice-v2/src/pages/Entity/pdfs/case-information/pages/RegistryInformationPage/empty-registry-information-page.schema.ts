import { BaseCaseInformationPdfSchema } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';
import { z } from 'zod';

export const emptyRegistryInformationPageSchema = BaseCaseInformationPdfSchema

export type TEmptyRegistryInformationPageData = z.infer<typeof emptyRegistryInformationPageSchema>;
