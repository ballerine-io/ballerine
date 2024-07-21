import { useMemo } from 'react';

import { customerContext } from '@/components/providers/CustomerProvider/customer.context';
import { CustomerContext } from '@/components/providers/CustomerProvider/types';
import { TCustomer } from '@/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';

const { Provider } = customerContext;

interface Props {
  children: AnyChildren;
  defaultCustomer: TCustomer;
}

export const CustomerProviderPortable = ({ children, defaultCustomer }: Props) => {
  const context = useMemo(() => {
    const ctx: CustomerContext = {
      customer: defaultCustomer,
    };

    return ctx;
  }, [defaultCustomer]);

  return <Provider value={context}>{children}</Provider>;
};
