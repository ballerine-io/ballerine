import React, { useMemo } from 'react';

import { customerContext } from '@/components/providers/CustomerProvider/customer.context';
import { CustomerContext } from '@/components/providers/CustomerProvider/types';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { AnyChildren } from '@ballerine/ui';

const { Provider } = customerContext;

export type FallbackComponent = React.ComponentType<{ errorMessage: string; statusCode: number }>;

interface Props {
  children: AnyChildren;
  loadingPlaceholder?: React.ReactNode;
  fallback?: FallbackComponent;
}

export const CustomerProvider = ({
  children,
  loadingPlaceholder,
  fallback: FallbackComponent,
}: Props) => {
  const { isLoading, error, customer } = useCustomerQuery();

  const context = useMemo(() => {
    const ctx: CustomerContext = {
      customer,
    };

    return ctx;
  }, [customer]);

  if (isLoading) return <>{loadingPlaceholder}</> || null;

  if (error)
    return FallbackComponent ? (
      <FallbackComponent errorMessage={error.message} statusCode={error.response.status} />
    ) : (
      <>Failed to load customer.Reason {error.message}</>
    );

  return <Provider value={context}>{children}</Provider>;
};
