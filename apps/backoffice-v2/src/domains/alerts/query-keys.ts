import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  fetchAlertDefinitionByAlertId,
  fetchAlertLabels,
  fetchAlerts,
} from '@/domains/alerts/fetchers';

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
  alertDefinitionByAlertId: ({ alertId }: { alertId: string }) => {
    return {
      queryKey: [
        {
          alertId,
        },
      ],
      queryFn: () => fetchAlertDefinitionByAlertId({ alertId }),
    };
  },
  alertLabels: () => ({
    queryKey: ['alertLabels'],
    queryFn: () => fetchAlertLabels(),
  }),
});
