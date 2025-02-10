import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
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
  const [{ from }, setSearchParams] = useZodSearchParams(StatisticsSearchSchema);

  const { data, isLoading, error } = useBusinessReportMetricsQuery({
    from,
    to: dayjs(from).add(1, 'month').format('YYYY-MM-DD'),
  });

  const handleDateChange = (newDate: Date) => {
    const formattedDate = dayjs(newDate).startOf('month').format('YYYY-MM-DD');

    setSearchParams({ from: formattedDate });
  };

  return {
    data,
    isLoading,
    error,
    date: dayjs(from).toDate(),
    setDate: handleDateChange,
  };
};
