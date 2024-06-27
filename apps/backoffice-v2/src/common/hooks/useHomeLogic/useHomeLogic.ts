import { ComponentProps, useEffect } from 'react';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { HomeSearchSchema } from '@/pages/Home/home-search-schema';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';

export const useHomeLogic = () => {
  const locale = useLocale();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [{ from, to }, setSearchParams] = useZodSearchParams(HomeSearchSchema);
  const { data: session } = useAuthenticatedUserQuery();
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();
  const isExample = customer?.config?.isExample;
  const isDemo = customer?.config?.isDemo;
  const { firstName, fullName, avatarUrl } = session?.user || {};
  const statisticsLink = `/${locale}/home/statistics${search}`;
  const workflowsLink = `/${locale}/home/workflows${search}`;
  const defaultTabValue = `${pathname}${search}`;

  useEffect(() => {
    if (pathname !== `/${locale}` && pathname !== `/${locale}/home`) {
      return;
    }

    navigate(`/${locale}/home/statistics`);
  }, [pathname, locale, navigate]);

  const onDateRangeChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from?.toISOString();
    const to = range?.to?.toISOString();

    setSearchParams({ from, to });
  };

  return {
    from,
    to,
    firstName,
    fullName,
    avatarUrl,
    statisticsLink,
    workflowsLink,
    defaultTabValue,
    onDateRangeChange,
    isLoadingCustomer,
    isExample,
    isDemo,
  };
};
