import { z } from 'zod';

export const DocumentSizeValidator = z.literal('documentSize');
export type TDocumentSizeValidator = z.infer<typeof DocumentSizeValidator>;

export const DocumentSizeValidatorParamsSchema = z.object({
  fileSizeLimit: z.number().optional(),
});

export type TDocumentSizeValidatorParams = z.infer<typeof DocumentSizeValidatorParamsSchema>;
