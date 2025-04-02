import dayjs from 'dayjs';
import { useEffect, type ComponentProps } from 'react';
import { z } from 'zod';

import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const StatisticsSearchSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export const useStatisticsLogic = () => {
  const [{ from, to }, setSearchParams] = useZodSearchParams(StatisticsSearchSchema, {
    replace: true,
  });

  useEffect(() => {
    const now = dayjs();
    const yesterday = now.subtract(1, 'day');

    if (!from || dayjs(from).isAfter(yesterday)) {
      setSearchParams({
        from: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      });
    }

    if (!to || dayjs(to).isAfter(now)) {
      setSearchParams({
        to: dayjs().format('YYYY-MM-DD'),
      });
    }
  }, []);

  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ from, to });
  };

  return {
    locale,
    customer,
    isLoadingCustomer,
    from,
    to,
    setDate: onDatesChange,
  };
};
