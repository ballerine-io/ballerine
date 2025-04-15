import { SortDirection } from '@ballerine/common';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import type { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { riskLevelToBackgroundColor, riskLevelToFillColor } from '../../constants';

export const usePortfolioRiskStatisticsLogic = ({
  violationCounts,
  from,
  to,
}: Pick<z.infer<typeof MetricsResponseSchema>, 'violationCounts'> & {
  from: ReturnType<typeof useHomeLogic>['mmFrom'];
  to: ReturnType<typeof useHomeLogic>['mmTo'];
}) => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [riskIndicatorsSorting, setRiskIndicatorsSorting] = useState<SortDirection>('desc');
  const onSortRiskIndicators = useCallback(
    (sort: SortDirection) => () => {
      setRiskIndicatorsSorting(sort);
    },
    [],
  );
  const { data: customer } = useCustomerQuery();

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

  const { data: businessReports } = useBusinessReportsQuery({
    isAlert: true,
    from,
    to,
  });

  const alertedReports = businessReports?.totalItems ?? 0;
  const isOngoingMonitoringEnabled = customer?.config?.isOngoingMonitoringEnabled ?? false;

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
    from,
    to,
    alertedReports,
    isOngoingMonitoringEnabled,
  };
};
