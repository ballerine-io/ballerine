import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const StatisticsOutputSchema = z.object({
  violations: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
});

export type StatisticsInput = {
  violationsDirection: 'asc' | 'desc';
};

export const fetchStatistics = async (body: StatisticsInput) => {
  const [statistics, error] = await apiClient({
    endpoint: `statistics`,
    method: Method.POST,
    schema: StatisticsOutputSchema,
    body,
  });

  return handleZodError(error, statistics);
};

// export const statisticsQueryKey = (body: StatisticsInput) => ['statistics', body] as const;

export const statisticsQueryKeys = createQueryKeys('statistics', {
  get: (body: StatisticsInput) => ({
    queryKey: [body],
    queryFn: () => fetchStatistics(body),
  }),
});

export const useStatisticsQuery = (body: StatisticsInput) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...statisticsQueryKeys.get(body),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};
