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
export const CreateKybAndUboCheckDialogSchema = z.object({
  companyName: z
    .string({
      invalid_type_error: 'Company name must be a string',
    })
    .max(255),
  registrationNumber: z
    .string({
      invalid_type_error: 'Registration number must be a string',
    })
    .max(255),
  country: z.string().max(255),
  state: z.string().optional(),
  correlationId: z.string().max(255),
});
