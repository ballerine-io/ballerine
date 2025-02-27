import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIOptions } from '@/domains/collection-flow';
import { useMemo } from 'react';
import { useLanguage } from '../useLanguage';
import { useUISchemasQuery } from '../useUISchemasQuery';

export const useRedirectUrls = () => {
  const { data } = useUISchemasQuery(useLanguage());
  const { config } = useStateManagerContext();

  const redirectUrls: UIOptions['redirectUrls'] | null = useMemo(
    () => config?.uiOptions?.redirectUrls ?? data?.uiOptions?.redirectUrls ?? null,
    [data, config],
  );

  return redirectUrls;
};
