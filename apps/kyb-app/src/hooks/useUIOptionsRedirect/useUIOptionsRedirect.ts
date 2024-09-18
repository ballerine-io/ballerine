import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useEffect } from 'react';

export const useUIOptionsRedirect = (state: 'success' | 'failure') => {
  const { data } = useUISchemasQuery(useLanguage());

  useEffect(() => {
    if (data?.uiOptions?.redirectUrls?.[state]) {
      location.href = data.uiOptions.redirectUrls?.[state] as string;
    }
  }, [data, state]);
};
