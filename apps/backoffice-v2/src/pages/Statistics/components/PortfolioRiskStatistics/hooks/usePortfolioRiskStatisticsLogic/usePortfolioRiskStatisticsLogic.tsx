import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from '@ballerine/common';
import {
  riskLevelToBackgroundColor,
  riskLevelToFillColor,
} from '@/pages/Statistics/components/PortfolioRiskStatistics/constants';
import { z } from 'zod';
import { HomeMetricsOutputSchema } from '@/domains/metrics/hooks/queries/useHomeMetricsQuery/useHomeMetricsQuery';

export const usePortfolioRiskStatisticsLogic = ({
  riskIndicators,
  reports,
}: {
  riskIndicators: z.infer<typeof HomeMetricsOutputSchema>['riskIndicators'];
  reports: z.infer<typeof HomeMetricsOutputSchema>['reports'];
}) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [riskIndicatorsSorting, setRiskIndicatorsSorting] = useState<SortDirection>('desc');
  const onSortRiskIndicators = useCallback(
    (sort: SortDirection) => () => {
      setRiskIndicatorsSorting(sort);
    },
    [],
  );
  const totalRiskIndicators = riskIndicators.reduce((acc, curr) => acc + curr.count, 0);
  const filteredRiskIndicators = useMemo(() => {
    return structuredClone(riskIndicators)
      .sort((a, b) => {
        if (riskIndicatorsSorting === 'asc') {
          return a.count - b.count;
        }

        return b.count - a.count;
      })
      .slice(0, 5);
  }, [riskIndicators, riskIndicatorsSorting]);
  const widths = useMemo(() => {
    const maxValue = Math.max(...filteredRiskIndicators.map(item => item.count), 0);

    return filteredRiskIndicators.map(item =>
      item.count === 0 ? 0 : Math.max((item.count / maxValue) * 100, 2),
    );
  }, [filteredRiskIndicators]);
  const filters = [
    {
      name: 'Merchant Monitoring',
      description: 'Risk Risk levels of all merchant monitoring reports.',
      entityPlural: 'Reports',
      riskLevels: {
        low: reports.all.low,
        medium: reports.all.medium,
        high: reports.all.high,
        critical: reports.all.critical,
      },
    },
    {
      name: 'Merchant Onboarding',
      description: 'Risk levels of all active onboarding cases.',
      entityPlural: 'Cases',
      riskLevels: {
        low: reports.inProgress.low,
        medium: reports.inProgress.medium,
        high: reports.inProgress.high,
        critical: reports.inProgress.critical,
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
    filteredRiskIndicators,
    totalRiskIndicators,
  };
};
