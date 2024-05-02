import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';
import qs from 'qs';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';
import {
  KYCs,
  Roles,
  Sanctions,
} from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';

export const IndividualProfileSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  name: z.string(),
  businesses: z.string().optional(),
  role: z.enum(Roles),
  kyc: z.enum(KYCs).or(z.undefined()),
  sanctions: z.enum(Sanctions),
  alerts: z.number(),
  updatedAt: z.string().datetime(),
});

export const IndividualsProfilesSchema = z.array(IndividualProfileSchema);

export type TIndividualProfile = z.infer<typeof IndividualProfileSchema>;

export type TIndividualsProfiles = z.infer<typeof IndividualsProfilesSchema>;

export const fetchIndividualsProfiles = async (params: {
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
}) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [individualsProfiles, error] = await apiClient({
    url: `${getOriginUrl(
      env.VITE_API_URL,
    )}/api/v1/case-management/profiles/individuals?${queryParams}`,
    method: Method.GET,
    schema: IndividualsProfilesSchema,
  });

  return handleZodError(error, individualsProfiles);
};
