import { z } from 'zod';

import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';

export const KybAndUboChecksSearchSchema = BaseSearchSchema.extend({
  status: z.array(z.string()).optional(),
  isCreating: z
    .string()
    .transform(value => value === 'true')
    .optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export type CreateKybAndUboCheckDialogInput = z.input<typeof CreateKybAndUboCheckDialogSchema>;
export const CreateKybAndUboCheckDialogSchema = z
  .object({
    companyName: z
      .string({
        required_error: 'Company name is required',
        invalid_type_error: 'Company name must be a string',
      })
      .min(1, { message: 'Company name is required' })
      .max(255),
    registrationNumber: z
      .string({
        required_error: 'Registration number is required',
        invalid_type_error: 'Registration number must be a string',
      })
      .min(1, { message: 'Registration number is required' })
      .max(255),
    country: z
      .string({
        required_error: 'Country is required',
      })
      .min(1, { message: 'Country is required' })
      .max(255),
    state: z.string().optional(),
    correlationId: z
      .string({
        required_error: 'Correlation ID is required',
      })
      .min(1, { message: 'Correlation ID is required' })
      .max(255),
  })
  .superRefine((val, ctx) => {
    if (val.country?.toLowerCase() === 'us' && !val.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'State is required for US',
        path: ['state'],
      });
    }
  });
