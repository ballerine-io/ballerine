import { fetchUIDefinition, fetchUIDefinitions } from '@/domains/ui-definitions/ui-definitions.api';
import { GetUIDefinitionByIdDto } from '@/domains/ui-definitions/ui-definitions.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const uiDefinitionsQueryKeys = createQueryKeys('uiDefinitions', {
  get: (query: GetUIDefinitionByIdDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchUIDefinition(query),
  }),
  list: () => ({
    queryKey: [{}],
    queryFn: () => fetchUIDefinitions(),
  }),
});
