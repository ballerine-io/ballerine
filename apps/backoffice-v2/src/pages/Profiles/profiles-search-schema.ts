import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import {
  KYCs,
  Roles,
  Sanctions,
} from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';

export const ProfilesSearchSchema = BaseSearchSchema.extend({
  sortBy: z
    .enum([
      'id',
      'createdAt',
      'name',
      'business',
      'role',
      'kyc',
      'sanctions',
      'alerts',
      'updatedAt',
    ] as const satisfies ReadonlyArray<
      keyof Array<{
        id: string;
        createdAt: string;
        name: string;
        business: string;
        role: string;
        kyc: string;
        sanctions: string;
        alerts: number;
        updatedAt: string;
      }>[number]
    >)
    .catch('createdAt'),
  filter: z
    .object({
      role: z.array(z.enum(Roles)).optional(),
      kyc: z.array(z.enum(KYCs)).optional(),
      sanctions: z.array(z.enum(Sanctions)).optional(),
    })
    .catch({
      role: [],
      kyc: [],
      sanctions: [],
    }),
});
