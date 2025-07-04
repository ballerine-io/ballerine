import { z } from 'zod';

export const PastDateValidator = z.literal('pastDate');
export type TPastDateValidator = z.infer<typeof PastDateValidator>;

export const PastDateValidatorParamsSchema = z.object({});

export type TPastDateValidatorParams = z.infer<typeof PastDateValidatorParamsSchema>;
