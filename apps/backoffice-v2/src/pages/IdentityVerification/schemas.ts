import { z } from 'zod';

import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';

export const IdentityVerificationSearchSchema = BaseSearchSchema.extend({
  status: z.array(z.string()).optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  workflowRuntimeDataId: z.string().optional(),
  entityId: z.string().optional(),
  isCreating: z
    .string()
    .transform(value => value === 'true')
    .optional(),
});

export type CreateIdentityVerificationDialogInput = z.input<
  typeof CreateIdentityVerificationDialogSchema
>;
export const CreateIdentityVerificationDialogSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: 'First name must be a string',
    })
    .max(255),
  lastName: z
    .string({
      invalid_type_error: 'Last name must be a string',
    })
    .max(255),
  country: z.string().max(255),
  state: z.string().optional(),
  dateOfBirth: z.string().date(),
});
