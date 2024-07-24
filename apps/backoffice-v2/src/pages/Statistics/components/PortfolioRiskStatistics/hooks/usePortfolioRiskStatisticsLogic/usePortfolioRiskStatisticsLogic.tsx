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
  setSorting,
  data,
}: {
  setSorting: React.Dispatch<React.SetStateAction<SortDirection>>;
  data: z.infer<typeof StatisticsOutputSchema>;
}) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const onSort = useCallback(
    (sort: SortDirection) => () => {
      setSorting(sort);
    },
    [],
  );
  const widths = useMemo(() => {
    const maxValue = Math.max(...data.violations.map(item => item.count), 0);

    return data.violations.map(item =>
      item.count === 0 ? 0 : Math.max((item.count / maxValue) * 100, 2),
    );
  }, [data]);
  const filters = [
    {
      name: 'Merchant Monitoring',
      riskLevels: {
        low: 15,
        medium: 50,
        high: 32,
        critical: 12,
      },
    },
    {
      name: 'Merchant Onboarding',
      riskLevels: {
        low: 3,
        medium: 5,
        high: 6,
        critical: 4,
      },
    },
  ];
  const totalIndicators = 49;
  const portfolio = {
    riskLevels: {
      low: 10,
      medium: 30,
      high: 25,
      critical: 15,
    },
  };

  return {
    portfolio,
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    filters,
    totalIndicators,
    onSort,
  };
};
