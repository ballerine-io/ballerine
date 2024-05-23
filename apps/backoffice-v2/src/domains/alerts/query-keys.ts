import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  fetchAlertCorrelationIds,
  fetchAlertDefinitionByAlertId,
  fetchAlerts,
} from '@/domains/alerts/fetchers';

export const alertsQueryKeys = createQueryKeys('alerts', {
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
  alertCorrelationIds: () => ({
    queryKey: [{}],
    queryFn: () => fetchAlertCorrelationIds(),
  }),
});
