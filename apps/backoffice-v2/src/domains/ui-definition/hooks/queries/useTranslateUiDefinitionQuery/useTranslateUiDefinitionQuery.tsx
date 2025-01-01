import { useQuery } from '@tanstack/react-query';

import { uiDefinitionQueryKeys } from '@/domains/ui-definition/query-keys';

export const useTranslateUiDefinitionQuery = ({
  id,
  partialUiDefinition,
  locale,
}: {
  id: string;
  partialUiDefinition: Record<string, unknown>;
  locale: string;
}) => {
  return useQuery({
    ...uiDefinitionQueryKeys.translate({ id, partialUiDefinition, locale }),
    enabled: !!partialUiDefinition && !!id,
  });
};
