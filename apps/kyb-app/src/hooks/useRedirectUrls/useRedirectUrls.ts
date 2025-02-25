import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIOptions } from '@/domains/collection-flow';
import { useMemo } from 'react';
import { useLanguage } from '../useLanguage';
import { useUISchemasQuery } from '../useUISchemasQuery';

export const useRedirectUrls = () => {
  const { data } = useUISchemasQuery(useLanguage());
  const { config } = useStateManagerContext();

  const uiOptions: UIOptions | null = useMemo(() => {
    // Config has priority over uiOptions in data
    if (config?.uiOptions?.redirectUrls) {
      return config.uiOptions;
    }

    if (data?.uiOptions?.redirectUrls) {
      return data.uiOptions;
    }

    return null;
  }, [data, config]);

  const redirectUrls: UIOptions['redirectUrls'] | null = useMemo(() => {
    if (!uiOptions) {
      return null;
    }

    return uiOptions.redirectUrls;
  }, [uiOptions]);

  return redirectUrls;
};
