import dayjs from 'dayjs';
import { useEffect, useMemo, type ComponentProps } from 'react';
import { titleCase } from 'string-ts';
import { z } from 'zod';

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

    if (!mmFrom && !mmTo && isMerchantMonitoringEnabled) {
      toSet.mmFrom = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
      toSet.mmTo = dayjs().format('YYYY-MM-DD');
    }

    if (!casesFrom && !casesTo && isCasesOnboardingEnabled) {
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

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status.toLowerCase() as keyof typeof STATUS_COLORS] ?? '#65afff';
  };

  const getRiskColor = (risk: string) => {
    return RISK_LEVEL_COLORS[risk.toLowerCase() as keyof typeof RISK_LEVEL_COLORS] ?? '#65afff';
  };

  type ConfigItem = { label: string; color: string };

  const statusConfig = useMemo<Record<string, ConfigItem>>(() => {
    if (!currentStats) return {};
    return currentStats.casesByStatus.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.status]: {
          label: titleCase(curr.status),
          color: getStatusColor(curr.status),
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
          color: getRiskColor(curr.riskLevel),
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
          color: getRiskColor(curr.riskLevel),
        },
      }),
      {},
    );
  }, [currentStats]);

  const casesByStatus = useMemo(() => {
    if (!currentStats) return [];
    return currentStats.casesByStatus.map(item => ({
      ...item,
      href: `/${locale}/case-management?filter[status][0]=${item.status}`,
    }));
  }, [currentStats]);

  const ongoingCasesByRisk = useMemo(() => {
    if (!currentStats) return [];
    return currentStats.ongoingCasesByRisk.map(item => ({
      ...item,
      href: `/${locale}/case-management?filter[status][0]=active&filter[riskLevel][0]=${item.riskLevel}`,
    }));
  }, [currentStats]);

  const approvedCasesByRisk = useMemo(() => {
    if (!currentStats) return [];
    return currentStats.approvedCasesByRisk.map(item => ({
      ...item,
      href: `/${locale}/case-management?filter[status][0]=completed&filter[riskLevel][0]=${item.riskLevel}`,
    }));
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

    casesByStatus,
    ongoingCasesByRisk,
    approvedCasesByRisk,

    totalActiveMerchants: metrics?.totalActiveMerchants ?? 0,
    addedMerchantsCount: metrics?.addedMerchantsCount ?? 0,
    removedMerchantsCount: metrics?.removedMerchantsCount ?? 0,
    riskLevelCounts:
      metrics?.riskLevelCounts ?? ({} as NonNullable<typeof metrics>['riskLevelCounts']),
    violationCounts: metrics?.violationCounts ?? [],

    statusConfig,
    ongoingRiskConfig,
    approvedRiskConfig,
    getStatusColor,
    getRiskColor,
  };
};
