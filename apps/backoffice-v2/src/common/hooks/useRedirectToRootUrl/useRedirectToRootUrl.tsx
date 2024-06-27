import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';

export const useRedirectToRootUrl = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  if (customer?.config?.isExample || customer?.config?.isDemo) {
    return `/${locale}/home/statistics`;
  }

  return `/${locale}/case-management/entities`;
};
