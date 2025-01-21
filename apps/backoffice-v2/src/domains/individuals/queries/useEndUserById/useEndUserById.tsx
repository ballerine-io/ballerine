import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { AmlSchema, HitSchema } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

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

export const endUsersQueryKeys = createQueryKeys('end-users', {
  byId: ({ id }: { id: string }) => ({
    queryKey: ['end-users', id],
    queryFn: () => getEndUserById({ id }),
  }),
});

export const useEndUserById = ({ id }: { id: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...endUsersQueryKeys.byId({ id }),
    enabled: !!id && isAuthenticated,
  });
};
