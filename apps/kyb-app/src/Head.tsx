import React from 'react';
import { Helmet } from 'react-helmet';
import { useCustomerQuery } from '@app/hooks/useCustomerQuery';

export const Head = () => {
  const { customer } = useCustomerQuery();

  return (
    <Helmet>
      <link rel="icon" href={customer?.faviconImageUri || '/favicon.ico'} />
    </Helmet>
  );
};
