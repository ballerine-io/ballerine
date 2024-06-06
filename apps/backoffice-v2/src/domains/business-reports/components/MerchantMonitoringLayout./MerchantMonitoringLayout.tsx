import React, { FunctionComponent } from 'react';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';
import { NotFoundRedirect } from '@/pages/NotFound/NotFound';
import { Outlet } from 'react-router-dom';

export const MerchantMonitoringLayout: FunctionComponent = () => {
  const { data: customer } = useCustomerQuery();

  if (!customer?.config?.isMerchantMonitoringEnabled) {
    return <NotFoundRedirect />;
  }

  return <Outlet />;
};
