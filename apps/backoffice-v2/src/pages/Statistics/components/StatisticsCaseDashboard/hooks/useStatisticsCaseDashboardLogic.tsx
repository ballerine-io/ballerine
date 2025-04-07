import { useMemo } from 'react';
import { titleCase } from 'string-ts';

import { useCaseCurrentStats } from '@/domains/metrics/hooks/queries/useCaseCurrentStats/useCaseCurrentStats';

const RISK_LEVEL_COLORS = {
  low: '#4CAF50',
  medium: '#FFB74D',
  high: '#FF5722',
  critical: '#F44336',
};

const STATUS_COLORS = {
  active: '#007aff',
  completed: '#4CAF50',
  failed: '#F44336',
  // pending: '#FFB74D',
};

export const useStatisticsCaseDashboardLogic = () => {
  const { data: staticMetrics, isLoading: isLoadingStaticMetrics } = useCaseCurrentStats();

  // Memoized color functions
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status.toLowerCase() as keyof typeof STATUS_COLORS] || '#65afff';
  };

  const getRiskColor = (risk: string) => {
    return RISK_LEVEL_COLORS[risk.toLowerCase() as keyof typeof RISK_LEVEL_COLORS] || '#65afff';
  };

  // Pre-calculate configs with empty data to ensure hooks are called unconditionally
  const statusConfig = useMemo(() => {
    if (!staticMetrics) return {};
    return staticMetrics.casesByStatus.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.status]: {
          label: titleCase(curr.status),
          color: getStatusColor(curr.status),
        },
      }),
      {},
    );
  }, [staticMetrics]);

  const ongoingRiskConfig = useMemo(() => {
    if (!staticMetrics) return {};
    return staticMetrics.ongoingCasesByRisk.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.riskLevel]: {
          label: titleCase(curr.riskLevel),
          color: getRiskColor(curr.riskLevel),
        },
      }),
      {},
    );
  }, [staticMetrics]);

  const approvedRiskConfig = useMemo(() => {
    if (!staticMetrics) return {};
    return staticMetrics.approvedCasesByRisk.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.riskLevel]: {
          label: titleCase(curr.riskLevel),
          color: getRiskColor(curr.riskLevel),
        },
      }),
      {},
    );
  }, [staticMetrics]);

  return {
    staticMetrics,
    isLoadingStaticMetrics,

    statusConfig,
    ongoingRiskConfig,
    approvedRiskConfig,
    getStatusColor,
    getRiskColor,
  };
};
