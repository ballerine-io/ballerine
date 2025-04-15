import { CollectionFlowConfig } from '@/domains/collection-flow/types/flow-context.types';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useMemo } from 'react';

export const useSuccessRedirectUrl = (collectionFlowConfig: CollectionFlowConfig | undefined) => {
  const { data } = useUISchemasQuery(useLanguage());

  const successRedirectUrl: string | undefined = useMemo(
    () =>
      collectionFlowConfig?.uiOptions?.redirectUrls?.success ??
      data?.uiOptions?.redirectUrls?.success,
    [data, collectionFlowConfig],
  );

  return successRedirectUrl;
};
