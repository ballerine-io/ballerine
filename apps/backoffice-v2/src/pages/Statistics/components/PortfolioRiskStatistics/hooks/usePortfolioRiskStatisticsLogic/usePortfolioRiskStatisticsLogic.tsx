import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from '@ballerine/common';
import {
  riskLevelToBackgroundColor,
  riskLevelToFillColor,
} from '@/pages/Statistics/components/PortfolioRiskStatistics/constants';
import { z } from 'zod';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { StatisticsSearchSchema } from '@/pages/Statistics/hooks/useStatisticsLogic';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';

export const usePortfolioRiskStatisticsLogic = ({
  violationCounts,
}: Pick<z.infer<typeof MetricsResponseSchema>, 'violationCounts'>) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [riskIndicatorsSorting, setRiskIndicatorsSorting] = useState<SortDirection>('desc');
  const onSortRiskIndicators = useCallback(
    (sort: SortDirection) => () => {
      setRiskIndicatorsSorting(sort);
    },
    [],
  );

  const filteredRiskIndicators = useMemo(
    () =>
      violationCounts
        .sort((a, b) => (riskIndicatorsSorting === 'asc' ? a.count - b.count : b.count - a.count))
        .slice(0, 10),
    [violationCounts, riskIndicatorsSorting],
  );

  const widths = useMemo(
    () =>
      filteredRiskIndicators.map(item =>
        item.count > 0
          ? Math.max(
              (item.count / Math.max(...filteredRiskIndicators.map(item => item.count), 0)) * 100,
              2,
            )
          : 0,
      ),
    [filteredRiskIndicators],
  );
  const locale = useLocale();
  const navigate = useNavigate();
  const getLast30DaysDateRange = () => {
    const today = dayjs();
    const thirtyDaysAgo = today.subtract(30, 'day');

    return {
      from: thirtyDaysAgo.format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
    };
  };

  const last30DaysDateRange = getLast30DaysDateRange();
  const [{ from }] = useZodSearchParams(StatisticsSearchSchema);

  const { data: businessReports } = useBusinessReportsQuery({
    isAlert: true,
    from,
    to: dayjs(from).add(1, 'month').format('YYYY-MM-DD'),
  });

  const alertedReports = businessReports?.totalItems ?? 0;

  return {
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    riskIndicatorsSorting,
    onSortRiskIndicators,
    filteredRiskIndicators,
    locale,
    navigate,
    from: last30DaysDateRange.from,
    to: last30DaysDateRange.to,
    alertedReports,
  };
};
