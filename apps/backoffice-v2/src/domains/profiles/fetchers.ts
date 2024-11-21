import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';
import qs from 'qs';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';
import { KYCs } from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';

export const IndividualProfileSchema = z.object({
  correlationId: z.string().nullable().optional(),
  createdAt: z.string(),
  name: z.string(),
  businesses: z.string().optional(),
  roles: z.array(z.string()).optional(),
  kyc: z.enum(KYCs).optional(),
  isMonitored: z.boolean(),
  matches: z.string(),
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
    timeout: 30_000,
  });

  return handleZodError(error, individualsProfiles);
};
