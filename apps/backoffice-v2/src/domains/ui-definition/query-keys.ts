import { createQueryKeys } from '@lukemorales/query-key-factory';
import { translateUiDefinition } from './fetchers';

export const uiDefinitionQueryKeys = createQueryKeys('ui-definition', {
  translate: ({
    id,
    partialUiDefinition,
    locale,
  }: {
    id: string;
    partialUiDefinition: Record<string, unknown>;
    locale: string;
  }) => {
    return {
      queryKey: [
        {
          id,
          partialUiDefinition,
          locale,
        },
      ],
      queryFn: () => translateUiDefinition({ id, partialUiDefinition, locale }),
    };
  },
});
