import { z } from 'zod';

export const FutureDateValidator = z.literal('futureDate');
export type TFutureDateValidator = z.infer<typeof FutureDateValidator>;

export const FutureDateValidatorParamsSchema = z.object({});

export type TFutureDateValidatorParams = z.infer<typeof FutureDateValidatorParamsSchema>;
