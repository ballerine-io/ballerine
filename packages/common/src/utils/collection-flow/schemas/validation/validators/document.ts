import { z } from 'zod';

export const DocumentValidator = z.literal('document');
export type TDocumentValidator = z.infer<typeof DocumentValidator>;

export const DocumentValidatorParamsSchema = z.object({});

export type TDocumentValidatorParams = z.infer<typeof DocumentValidatorParamsSchema>;
