import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

import { Method } from '@/common/enums';

import { z } from 'zod';

import { HitSchema } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';

import { apiClient } from '@/common/api-client/api-client';

export const EndUserSchema = z.object({
  amlHits: z.array(HitSchema.extend({ vendor: z.string().optional() })).optional(),
});

export const getEndUserById = async ({ id }: { id: string }) => {
  const [endUser, error] = await apiClient({
    endpoint: `end-users/${id}`,
    method: Method.GET,
    schema: EndUserSchema,
    timeout: 30_000,
  });

  return handleZodError(error, endUser);
};
