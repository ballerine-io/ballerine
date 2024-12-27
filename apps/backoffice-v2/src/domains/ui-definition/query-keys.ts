import { createQueryKeys } from '@lukemorales/query-key-factory';
import { translateUiDefinition } from './fetchers';

export const uiDefinitionQueryKeys = createQueryKeys('ui-definition', {
  translate: ({
    id,
    partialUiDefinition,
  }: {
    id: string;
    partialUiDefinition: Record<string, unknown>;
  }) => {
    return {
      queryKey: [
        {
          id,
          partialUiDefinition,
        },
      ],
      queryFn: () => translateUiDefinition({ id, partialUiDefinition }),
    };
  },
});
