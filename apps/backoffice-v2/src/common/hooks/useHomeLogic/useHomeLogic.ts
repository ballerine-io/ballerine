import dayjs from 'dayjs';
import { useEffect, useMemo, type ComponentProps } from 'react';
import { titleCase } from 'string-ts';
import { z } from 'zod';

import { StateTag } from '@ballerine/common';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCaseCurrentStats } from '@/domains/metrics/hooks/queries/useCaseCurrentStats/useCaseCurrentStats';

export const HomeSearchSchema = z.object({
  mmFrom: z.string().date().optional(),
  mmTo: z.string().date().optional(),
  casesFrom: z.string().date().optional(),
  casesTo: z.string().date().optional(),
  allowAllDates: z
    .string()
    .transform(value => value === 'true')
    .optional(),
});

type PieChartDefinition = Record<string, { color: string; text: string }>;

const RISK_LEVEL_DEFINITION: PieChartDefinition = {
  low: { color: '#4CAF50', text: 'Low Risk' },
  medium: { color: '#FFB74D', text: 'Medium Risk' },
  high: { color: '#FF5722', text: 'High Risk' },
  critical: { color: '#F44336', text: 'Critical Risk' },
};

const STATUS_DEFINITION: PieChartDefinition = {
  [StateTag.APPROVED]: { color: '#4CAF50', text: 'Approved' },
  [StateTag.REVISION]: { color: '#FFB74D', text: 'Revisions' },
  [StateTag.EDIT]: { color: '#FFB74D', text: 'Edit' },
  [StateTag.REJECTED]: { color: '#F44336', text: 'Rejected' },
  [StateTag.RESOLVED]: { color: '#4CAF50', text: 'Resolved' },
  [StateTag.MANUAL_REVIEW]: { color: '#007AFF', text: 'Manual Review' },
  [StateTag.COLLECTION_FLOW]: { color: '#961EEE', text: 'Collection in Progress' },
  [StateTag.PENDING_PROCESS]: { color: '#FFB74D', text: 'Pending ID Verification' },
  [StateTag.FAILURE]: { color: '#F44336', text: 'Failed' },
  [StateTag.DATA_ENRICHMENT]: { color: '#961EEE', text: 'Awaiting 3rd Party Data' },
  [StateTag.DISMISSED]: { color: '#4CAF50', text: 'Dismissed' },
  [StateTag.FLAGGED]: { color: '#F44336', text: 'Flagged' },
} as const;

export const useHomeLogic = () => {
  const locale = useLocale();
  const { data: session } = useAuthenticatedUserQuery();
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();
  const { firstName, fullName, avatarUrl } = session?.user ?? {};

  const isMerchantMonitoringEnabled = customer?.config?.isMerchantMonitoringEnabled ?? false;
  const isOngoingMonitoringEnabled = customer?.config?.isOngoingMonitoringEnabled ?? false;
  const isCasesOnboardingEnabled = customer?.config?.isCasesOnboardingEnabled ?? false;

  const [{ mmFrom, mmTo, casesFrom, casesTo, allowAllDates }, setSearchParams] = useZodSearchParams(
    HomeSearchSchema,
    { replace: true },
  );

  useEffect(() => {
    if (allowAllDates) {
      return;
    }

    const toSet: Partial<z.infer<typeof HomeSearchSchema>> = {};

    if (!mmFrom && !mmTo && isMerchantMonitoringEnabled && !customer?.config?.demoAccessDetails) {
      toSet.mmFrom = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
      toSet.mmTo = dayjs().format('YYYY-MM-DD');
    }

    if (
      !casesFrom &&
      !casesTo &&
      isCasesOnboardingEnabled &&
      !customer?.config?.demoAccessDetails
    ) {
      toSet.casesFrom = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
      toSet.casesTo = dayjs().format('YYYY-MM-DD');
    }

    setSearchParams(toSet);
  }, [customer]);

  const { data: metrics, isLoading: isLoadingMetrics } = useBusinessReportMetricsQuery({
    from: mmFrom,
    to: mmTo ? dayjs(mmTo).add(1, 'day').format('YYYY-MM-DD') : undefined,
  });

  const onMMDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ mmFrom: from, mmTo: to, allowAllDates: !from && !to });
  };

  const onCasesDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ casesFrom: from, casesTo: to, allowAllDates: !from && !to });
  };

  const { data: currentStats, isLoading: isLoadingCurrentStats } = useCaseCurrentStats();

  const getStatusDefinition = (status: string) => {
    return (
      STATUS_DEFINITION[status.toLowerCase() as keyof typeof STATUS_DEFINITION] ?? {
        color: '#65AFFF',
        text: titleCase(status),
      }
    );
  };

  const getRiskDefinition = (risk: string) => {
    return (
      RISK_LEVEL_DEFINITION[risk.toLowerCase() as keyof typeof RISK_LEVEL_DEFINITION] ?? {
        color: '#65afff',
        text: titleCase(risk),
      }
    );
  };

  type ConfigItem = { label: string; color: string };

  const statusConfig = useMemo<Record<string, ConfigItem>>(() => {
    if (!currentStats) return {};
    return currentStats.casesByStatus.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.status]: {
          label: titleCase(curr.status),
          color: getStatusDefinition(curr.status),
        },
      }),
      {},
    );
  }, [currentStats]);

  const ongoingRiskConfig = useMemo<Record<string, ConfigItem>>(() => {
    if (!currentStats) return {};
    return currentStats.ongoingCasesByRisk.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.riskLevel]: {
          label: titleCase(curr.riskLevel),
          color: getRiskDefinition(curr.riskLevel),
        },
      }),
      {},
    );
  }, [currentStats]);

  const approvedRiskConfig = useMemo<Record<string, ConfigItem>>(() => {
    if (!currentStats) return {};
    return currentStats.approvedCasesByRisk.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.riskLevel]: {
          label: titleCase(curr.riskLevel),
          color: getRiskDefinition(curr.riskLevel),
        },
      }),
      {},
    );
  }, [currentStats]);

  return {
    firstName,
    fullName,
    avatarUrl,
    locale,

    isMerchantMonitoringEnabled,
    isOngoingMonitoringEnabled,
    isCasesOnboardingEnabled,

    isLoadingCustomer,
    isLoadingMetrics,
    isLoadingCurrentStats,

    mmFrom,
    mmTo,
    setMMDate: onMMDatesChange,

    casesFrom,
    casesTo,
    setCasesDate: onCasesDatesChange,

    casesByStatus: currentStats?.casesByStatus ?? [],
    ongoingCasesByRisk: currentStats?.ongoingCasesByRisk ?? [],
    approvedCasesByRisk: currentStats?.approvedCasesByRisk ?? [],

    totalActiveMerchants: metrics?.totalActiveMerchants ?? 0,
    addedMerchantsCount: metrics?.addedMerchantsCount ?? 0,
    removedMerchantsCount: metrics?.removedMerchantsCount ?? 0,
    riskLevelCounts:
      metrics?.riskLevelCounts ?? ({} as NonNullable<typeof metrics>['riskLevelCounts']),
    violationCounts: metrics?.violationCounts ?? [],

    statusConfig,
    ongoingRiskConfig,
    approvedRiskConfig,
    getStatusDefinition,
    getRiskDefinition,
  };
};
