import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import dayjs from 'dayjs';
import { z } from 'zod';

export const StatisticsSearchSchema = z.object({
  from: z
    .string()
    .date()
    .optional()
    .transform(value =>
      value
        ? dayjs(value).startOf('month').format('YYYY-MM-DD')
        : dayjs().startOf('month').format('YYYY-MM-DD'),
    ),
});

export const useStatisticsLogic = () => {
  const locale = useLocale();
  const [{ from }, setSearchParams] = useZodSearchParams(StatisticsSearchSchema, { replace: true });

  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error,
  } = useBusinessReportMetricsQuery({
    from,
    to: dayjs(from).add(1, 'month').format('YYYY-MM-DD'),
  });

  const handleDateChange = (newDate: Date) => {
    const formattedDate = dayjs(newDate).startOf('month').format('YYYY-MM-DD');

    setSearchParams({ from: formattedDate });
  };

  return {
    locale,
    metrics,
    isLoadingMetrics,
    customer,
    isLoadingCustomer,
    error,
    date: dayjs(from).toDate(),
    setDate: handleDateChange,
  };
};
