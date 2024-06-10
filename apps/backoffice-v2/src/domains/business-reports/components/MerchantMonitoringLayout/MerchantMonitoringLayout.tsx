import React, { FunctionComponent } from 'react';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';
import { NotFoundRedirect } from '@/pages/NotFound/NotFound';
import { Outlet } from 'react-router-dom';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';

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
