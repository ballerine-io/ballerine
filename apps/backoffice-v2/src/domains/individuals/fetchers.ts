import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

import { Method } from '@/common/enums';

import { z } from 'zod';

import { HitSchema } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';

import { apiClient } from '@/common/api-client/api-client';

export const EndUserSchema = z.object({
  id: z.string(),
  amlHits: z.array(HitSchema.extend({ vendor: z.string().optional() })).optional(),
});

export const EndUsersSchema = z.array(EndUserSchema);

export const getEndUserById = async ({ id }: { id: string }) => {
  const [endUser, error] = await apiClient({
    endpoint: `end-users/${id}`,
    method: Method.GET,
    schema: EndUserSchema,
    timeout: 30_000,
  });

  return handleZodError(error, endUser);
};

export const getEndUsersByIds = async ({ ids }: { ids: string[] }) => {
  const [endUsers, error] = await apiClient({
    endpoint: `../external/end-users/by-ids`,
    method: Method.POST,
    schema: EndUsersSchema,
    timeout: 30_000,
    body: { ids },
  });

  return handleZodError(error, endUsers);
};
