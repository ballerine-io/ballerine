import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from '@ballerine/common';
import {
  riskLevelToBackgroundColor,
  riskLevelToFillColor,
} from '@/pages/Statistics/components/PortfolioRiskStatistics/constants';
import { StatisticsOutputSchema } from '@/pages/Statistics/statistics.query';
import { z } from 'zod';

export const usePortfolioRiskStatisticsLogic = ({
  data,
}: {
  data: z.infer<typeof StatisticsOutputSchema>;
}) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [riskIndicatorsSorting, setRiskIndicatorsSorting] = useState<SortDirection>('desc');
  const onSortRiskIndicators = useCallback(
    (sort: SortDirection) => () => {
      setRiskIndicatorsSorting(sort);
    },
    [],
  );
  const totalRiskIndicators = data.riskIndicators.reduce((acc, curr) => acc + curr.count, 0);
  const riskIndicators = useMemo(() => {
    return structuredClone(data.riskIndicators)
      .sort((a, b) => {
        if (riskIndicatorsSorting === 'asc') {
          return a.count - b.count;
        }
        return b.count - a.count;
      })
      .slice(0, 5);
  }, [data, riskIndicatorsSorting]);
  const widths = useMemo(() => {
    const maxValue = Math.max(...riskIndicators.map(item => item.count), 0);

    return riskIndicators.map(item =>
      item.count === 0 ? 0 : Math.max((item.count / maxValue) * 100, 2),
    );
  }, [riskIndicators]);
  const filters = [
    {
      name: 'Merchant Monitoring',
      description: 'Risk Risk levels of all merchant monitoring reports.',
      entityPlural: 'Reports',
      riskLevels: {
        low: data.reports.all.low,
        medium: data.reports.all.medium,
        high: data.reports.all.high,
        critical: data.reports.all.critical,
      },
    },
    {
      name: 'Merchant Onboarding',
      description: 'Risk levels of all active onboarding cases.',
      entityPlural: 'Cases',
      riskLevels: {
        low: data.reports.inProgress.low,
        medium: data.reports.inProgress.medium,
        high: data.reports.inProgress.high,
        critical: data.reports.inProgress.critical,
      },
    },
  ];

  return {
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    filters,
    riskIndicatorsSorting,
    onSortRiskIndicators,
    riskIndicators,
    totalRiskIndicators,
  };
};
