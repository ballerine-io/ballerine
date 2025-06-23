import { z } from 'zod';

import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';

export const KybAndOwnershipAssessmentsSearchSchema = BaseSearchSchema.extend({
  status: z.array(z.string()).optional(),
  isCreating: z
    .string()
    .transform(value => value === 'true')
    .optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export type CreateKybAndOwnershipAssessmentDialogInput = z.input<
  typeof CreateKybAndOwnershipAssessmentDialogSchema
>;

export const CreateKybAndOwnershipAssessmentDialogSchema = z
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
    businessId: z.string().max(255).optional(),
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
