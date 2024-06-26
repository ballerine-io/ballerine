import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from '@ballerine/common';
import {
  riskLevelToBackgroundColor,
  riskLevelToFillColor,
} from '@/pages/Statistics/components/PortfolioRiskStatistics/constants';

export const usePortfolioRiskStatisticsLogic = () => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [sorting, setSorting] = useState<SortDirection>('desc');
  const onSort = useCallback(
    (sort: SortDirection) => () => {
      setSorting(sort);
    },
    [],
  );
  const sortedData = useMemo(
    () =>
      [
        { riskType: 'Scam and fraud', amount: 15 },
        { riskType: 'IP Rights Infringement', amount: 12 },
        { riskType: 'Missing Terms and Conditions', amount: 10 },
        { riskType: 'Counterfeit Goods', amount: 8 },
        { riskType: 'Sanctions', amount: 4 },
      ]
        ?.slice()
        .sort((a, b) => {
          if (sorting === 'asc') {
            return a.amount - b.amount;
          }

          return b.amount - a.amount;
        }),
    [sorting],
  );
  const widths = useMemo(() => {
    const maxValue = Math.max(...sortedData.map(item => item.amount), 0);

    return sortedData.map(item =>
      item.amount === 0 ? 0 : Math.max((item.amount / maxValue) * 100, 2),
    );
  }, [sortedData]);
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
    sorting,
    onSort,
    sortedData,
  };
};
