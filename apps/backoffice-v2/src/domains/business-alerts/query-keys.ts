import { fetchAlertDefinitionByAlertId } from '@/domains/alerts/fetchers';
import { fetchAlertLabels, fetchBusinessAlerts } from '@/domains/business-alerts/fetchers';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const businessAlertsQueryKeys = createQueryKeys('alerts', {
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
      queryFn: () => fetchBusinessAlerts(data),
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
    queryKey: [{}],
    queryFn: () => fetchAlertLabels(),
  }),
});
