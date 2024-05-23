import { fetchBusinessAlerts } from '@/domains/business-alerts/fetchers';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const businessAlertsQueryKeys = createQueryKeys('alerts', {
  list: ({
    sortBy,
    sortDir,
    page,
    pageSize,
    ...params
  }: {
    sortBy: string;
    sortDir: string;
    page: number;
    pageSize: number;
    search: string;
    filter: Record<string, unknown>;
  }) => {
    const data = {
      ...params,
      orderBy: `${sortBy}:${sortDir}`,
      page: {
        number: Number(page),
        size: Number(pageSize),
      },
    };

    return {
      queryKey: [
        {
          ...params,
          sortBy,
          sortDir,
          page,
          pageSize,
        },
      ],
      queryFn: () => fetchBusinessAlerts(data),
    };
  },
});
