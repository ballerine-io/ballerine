import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useHomeLogic = () => {
  const locale = useLocale();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
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

  return {
    firstName,
    fullName,
    avatarUrl,
    statisticsLink,
    workflowsLink,
    defaultTabValue,
    isLoadingCustomer,
    isExample,
    isDemo,
  };
};
