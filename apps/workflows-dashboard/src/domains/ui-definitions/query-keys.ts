import { fetchUIDefinitions } from '@/domains/ui-definitions/ui-definitions.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const uiDefinitionsQueryKeys = createQueryKeys('uiDefinitions', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => fetchUIDefinitions(),
  }),
});
