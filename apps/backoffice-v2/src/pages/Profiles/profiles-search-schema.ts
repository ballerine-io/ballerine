import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import { KYCs, Roles } from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';
import { TIndividualProfile } from '@/domains/profiles/fetchers';

export const ProfilesSearchSchema = BaseSearchSchema.extend({
  sortBy: z
    .enum([
      'id',
      'createdAt',
      'name',
      'businesses',
      'role',
      'kyc',
      'sanctions',
      'alerts',
      'updatedAt',
    ] as const satisfies ReadonlyArray<keyof TIndividualProfile>)
    .catch('createdAt'),
  filter: z
    .object({
      role: z.array(z.enum(Roles)).optional(),
      kyc: z.array(z.enum(KYCs)).optional(),
      sanctions: z.array(z.string()).optional(),
    })
    .catch({
      role: [],
      kyc: [],
      sanctions: [],
    }),
});
