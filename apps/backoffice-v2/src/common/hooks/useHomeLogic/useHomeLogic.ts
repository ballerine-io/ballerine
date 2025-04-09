import dayjs from 'dayjs';
import { useEffect, type ComponentProps } from 'react';
import { z } from 'zod';

import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const HomeSearchSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export const useHomeLogic = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();
  const { firstName, fullName, avatarUrl } = session?.user ?? {};

  const [{ from, to }, setSearchParams] = useZodSearchParams(HomeSearchSchema, {
    replace: true,
  });

  useEffect(() => {
    if (from || to) {
      return;
    }

    setSearchParams({
      from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    });
  }, []);

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ from, to });
  };

  return {
    customer,
    isLoadingCustomer,
    from,
    to,
    setDate: onDatesChange,
    firstName,
    fullName,
    avatarUrl,
  };
};
