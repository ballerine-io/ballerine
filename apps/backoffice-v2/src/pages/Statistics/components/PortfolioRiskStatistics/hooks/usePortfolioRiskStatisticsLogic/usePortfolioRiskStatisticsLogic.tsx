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
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import dayjs from 'dayjs';

export const usePortfolioRiskStatisticsLogic = ({
  riskLevelCounts,
  violationCounts,
}: Pick<z.infer<typeof MetricsResponseSchema>, 'riskLevelCounts' | 'violationCounts'>) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [riskIndicatorsSorting, setRiskIndicatorsSorting] = useState<SortDirection>('desc');
  const onSortRiskIndicators = useCallback(
    (sort: SortDirection) => () => {
      setRiskIndicatorsSorting(sort);
    },
    [],
  );
  const totalRiskIndicators = violationCounts.reduce((acc, { count }) => acc + count, 0);
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

  const { from, to } = getLast30DaysDateRange();
  const { data: businessReports } = useBusinessReportsQuery({
    isAlert: true,
  });
  const alertedReports = businessReports?.data?.length ?? 0;

  return {
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    riskIndicatorsSorting,
    onSortRiskIndicators,
    filteredRiskIndicators,
    totalRiskIndicators,
    locale,
    navigate,
    from,
    to,
    alertedReports,
  };
};
