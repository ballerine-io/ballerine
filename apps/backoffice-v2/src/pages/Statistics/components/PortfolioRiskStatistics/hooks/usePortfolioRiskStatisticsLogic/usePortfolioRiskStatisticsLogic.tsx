import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from '@ballerine/common';
import {
  riskLevelToBackgroundColor,
  riskLevelToFillColor,
} from '@/pages/Statistics/components/PortfolioRiskStatistics/constants';
import { z } from 'zod';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';

export const usePortfolioRiskStatisticsLogic = ({
  riskLevelCounts,
  violationCounts,
}: z.infer<typeof MetricsResponseSchema>) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [riskIndicatorsSorting, setRiskIndicatorsSorting] = useState<SortDirection>('desc');
  const onSortRiskIndicators = useCallback(
    (sort: SortDirection) => () => {
      setRiskIndicatorsSorting(sort);
    },
    [],
  );
  const totalRiskIndicators = Object.values(violationCounts).reduce((acc, curr) => acc + curr, 0);
  const filteredRiskIndicators = useMemo(() => {
    return Object.entries(violationCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => {
        if (riskIndicatorsSorting === 'asc') {
          return a.count - b.count;
        }

        return b.count - a.count;
      })
      .slice(0, 5);
  }, [violationCounts, riskIndicatorsSorting]);
  const widths = useMemo(() => {
    const maxValue = Math.max(...filteredRiskIndicators.map(item => item.count), 0);

    return filteredRiskIndicators.map(item =>
      item.count === 0 ? 0 : Math.max((item.count / maxValue) * 100, 2),
    );
  }, [filteredRiskIndicators]);

  return {
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    riskIndicatorsSorting,
    onSortRiskIndicators,
    filteredRiskIndicators,
    totalRiskIndicators,
  };
};
