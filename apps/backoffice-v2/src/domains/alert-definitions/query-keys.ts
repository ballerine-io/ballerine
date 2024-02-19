import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchAlertDefinitionByAlertId } from '@/domains/alert-definitions/fetchers';

export const alertDefinitionsQueryKeys = createQueryKeys('alerts', {
  byAlertId: ({ alertId }: { alertId: string }) => {
    return {
      queryKey: [
        {
          alertId,
        },
      ],
      queryFn: () => fetchAlertDefinitionByAlertId({ alertId }),
    };
  },
});
