import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIOptions } from '@/domains/collection-flow';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useEffect, useMemo } from 'react';

export const useUIOptionsRedirect = (state: 'success' | 'failure') => {
  const { data } = useUISchemasQuery(useLanguage());
  const { config } = useStateManagerContext();

  const uiOptions: UIOptions | null = useMemo(() => {
    // Config has priority over uiOptions in data
    if (config?.uiOptions?.redirectUrls) return config.uiOptions;

    if (data?.uiOptions?.redirectUrls) return data.uiOptions;

    return null;
  }, [data, config]);

  const redirectUrls: UIOptions['redirectUrls'] | null = useMemo(() => {
    if (!uiOptions) return null;

    return uiOptions.redirectUrls;
  }, [uiOptions]);

  useEffect(() => {
    if (redirectUrls?.[state]) {
      const redirectUrl = redirectUrls[state] as string;
      console.info(`Collection Flow resolved to ${state}. Redirecting to ${redirectUrl}`);
      location.href = redirectUrls[state] as string;
    }
  }, [redirectUrls, state]);
};
