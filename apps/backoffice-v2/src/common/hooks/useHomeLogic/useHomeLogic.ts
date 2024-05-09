import { ComponentProps, useEffect } from 'react';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { HomeSearchSchema } from '@/pages/Home/home-search-schema';
import { t } from 'i18next';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useLocation, useNavigate } from 'react-router-dom';

export const useHomeLogic = () => {
  const locale = useLocale();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [{ from, to }, setSearchParams] = useZodSearchParams(HomeSearchSchema);
  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};
  const queryParams = from || to ? `?from=${from}&to=${to}` : '';
  const statisticsLink = `/${locale}/home/statistics${queryParams}`;
  const workflowsLink = `/${locale}/home/workflows${queryParams}`;

  useEffect(() => {
    if (pathname !== `/${locale}` && pathname !== `/${locale}/home`) {
      return;
    }

    navigate(`/${locale}/home/statistics`);
  }, [pathname, locale, navigate]);

  const handleDateRangeChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from?.toISOString();
    const to = range?.to?.toISOString();

    setSearchParams({ from, to });
  };

  return {
    from,
    to,
    t,
    firstName,
    fullName,
    avatarUrl,
    statisticsLink,
    workflowsLink,
    pathname,
    locale,
    handleDateRangeChange,
  };
};
