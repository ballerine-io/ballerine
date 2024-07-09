import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const useRedirectToRootUrl = () => {
  const locale = useLocale();

  return `/${locale}/home/statistics`;
};
