import { useQuery } from '@tanstack/react-query';

import { uiDefinitionQueryKeys } from '@/domains/ui-definition/query-keys';

export const useTranslateUiDefinitionQuery = ({
  id,
  partialUiDefinition,
}: {
  id: string;
  partialUiDefinition: Record<string, unknown>;
}) => {
  return useQuery({
    ...uiDefinitionQueryKeys.translate({ id, partialUiDefinition }),
    enabled: !!partialUiDefinition && !!id,
  });
};
