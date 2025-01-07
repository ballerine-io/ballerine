import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import dayjs from 'dayjs';
import { useState } from 'react';
import { z } from 'zod';

export const useStatisticsLogic = () => {
  const { data: userData } = useAuthenticatedUserQuery();
  const registrationDate = new Date(userData?.user?.registrationDate ?? '1970-01-01');

  const StatisticsSearchSchema = z.object({
    from: z
      .string()
      .optional()
      .transform(data => {
        const dayjsDate = dayjs(data, 'YYYY-MM-DD', true);

        return dayjsDate.isValid() &&
          dayjsDate.isBefore(dayjs()) &&
          dayjsDate.date() === 1 &&
          dayjsDate.add(1, 'day').isAfter(dayjs(registrationDate).startOf('month'))
          ? data
          : dayjs().startOf('month').format('YYYY-MM-DD');
      }),
  });

  const [{ from }, setSearchParams] = useZodSearchParams(StatisticsSearchSchema);
  const [date, setDate] = useState<string | undefined>(from ?? undefined);
  const { data, isLoading, error } = useBusinessReportMetricsQuery({
    from: date,
    to: dayjs(date).add(1, 'month').format('YYYY-MM-DD'),
  });

  const handleDateChange = (newDate: Date) => {
    const formattedDate = dayjs(newDate).startOf('month').format('YYYY-MM-DD');
    const result = StatisticsSearchSchema.safeParse({ from: formattedDate });

    if (result.success) {
      setSearchParams({ from: result.data.from });
      setDate(result.data.from);
    }
  };

  return {
    data,
    isLoading,
    error,
    date: dayjs(date).toDate(),
    setDate: handleDateChange,
    registrationDate,
  };
};
