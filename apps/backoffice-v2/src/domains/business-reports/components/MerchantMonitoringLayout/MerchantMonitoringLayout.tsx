import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

import { NotFoundRedirect } from '@/pages/NotFound/NotFound';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const MerchantMonitoringLayout: FunctionComponent = () => {
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();

  if (isLoadingCustomer) {
    return <FullScreenLoader />;
  }

  if (!customer?.config?.isMerchantMonitoringEnabled) {
    return <NotFoundRedirect />;
  }

  return <Outlet />;
};
