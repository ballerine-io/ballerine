import { fetchAlertDefinitionsList } from '@/domains/alert-definitions/alert-definitions.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const alertDefinitionsQueryKeys = createQueryKeys('alertDefinitions', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => fetchAlertDefinitionsList(),
  }),
});
