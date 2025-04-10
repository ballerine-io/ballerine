import { CollectionFlowConfig } from '@/domains/collection-flow/types/flow-context.types';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useMemo } from 'react';

export const useFailureRedirectUrl = (collectionFlowConfig: CollectionFlowConfig | undefined) => {
  const { data } = useUISchemasQuery(useLanguage());

  const failureRedirectUrl: string | undefined = useMemo(
    () =>
      collectionFlowConfig?.uiOptions?.redirectUrls?.failure ??
      data?.uiOptions?.redirectUrls?.failure,
    [data, collectionFlowConfig],
  );

  return failureRedirectUrl;
};
