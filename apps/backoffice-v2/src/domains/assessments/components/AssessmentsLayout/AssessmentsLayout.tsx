import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';

export const AssessmentsLayout: FunctionComponent = () => {
  const { isLoading: isLoadingCustomer } = useCustomerQuery();

  if (isLoadingCustomer) {
    return <FullScreenLoader />;
  }

  return <Outlet />;
};
