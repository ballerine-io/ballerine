import { Helmet } from 'react-helmet-async';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';

export const Head = () => {
  const { customer } = useCustomerQuery();

  return (
    <Helmet>
      <link rel="icon" href={customer?.faviconImageUri || '/favicon.ico'} />
    </Helmet>
  );
};
