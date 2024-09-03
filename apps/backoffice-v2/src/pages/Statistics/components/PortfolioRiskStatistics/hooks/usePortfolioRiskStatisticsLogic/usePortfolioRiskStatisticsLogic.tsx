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
  reportsRisks,
  reportStatuses,
  mccCounts,
}: z.output<typeof HomeMetricsOutputSchema>) => {
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
      name: 'All Merchant Monitoring',
      description: 'Risk Risk levels of all merchant monitoring reports.',
      entityPlural: 'Reports',
      riskLevels: {
        low: reportsRisks?.all?.low,
        medium: reportsRisks?.all?.medium,
        high: reportsRisks?.all?.high,
        critical: reportsRisks?.all?.critical,
      },
    },
    {
      name: 'Approved Merchant Onboarding',
      description: 'Risk levels of all Approved merchant onboarding reports.',
      entityPlural: 'Cases',
      riskLevels: {
        low: reportsRisks?.approved?.low,
        medium: reportsRisks?.approved?.medium,
        high: reportsRisks?.approved?.high,
        critical: reportsRisks?.approved?.critical,
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
