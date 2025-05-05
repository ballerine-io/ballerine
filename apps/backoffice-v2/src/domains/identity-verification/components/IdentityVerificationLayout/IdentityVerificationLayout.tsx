import { FunctionComponent } from 'react';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { Outlet } from 'react-router-dom';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';

export const IdentityVerificationLayout: FunctionComponent = () => {
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();

  if (isLoadingCustomer) {
    return <FullScreenLoader />;
  }

  return <Outlet />;
};
