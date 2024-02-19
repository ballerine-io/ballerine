import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchAlerts } from '@/domains/alerts/fetchers';

export const alertsQueryKeys = createQueryKeys('alerts', {
  list: ({ sortBy, sortDir, page, pageSize, ...params }) => {
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
      queryFn: () => fetchAlerts(data),
    };
  },
});
