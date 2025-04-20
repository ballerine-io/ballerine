import dayjs from 'dayjs';
import { SlidersHorizontal } from 'lucide-react';
import { ComponentProps, useCallback, useEffect, useMemo } from 'react';

import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useFindings } from '@/pages/MerchantMonitoring/hooks/useFindings/useFindings';
import {
  DISPLAY_TEXT_TO_IS_ALERT,
  DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE,
  IS_ALERT_TO_DISPLAY_TEXT,
  MerchantMonitoringSearchSchema,
  REPORT_STATUS_LABEL_TO_VALUE_MAP,
  REPORT_TYPE_TO_DISPLAY_TEXT,
  RISK_LEVEL_FILTER,
  STATUS_LEVEL_FILTER,
  TReportStatusValue,
} from '@/pages/MerchantMonitoring/schemas';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { getDemoStateErrorText } from '@/common/components/molecules/DemoAccessCards/getDemoStateErrorText';
import { toast } from 'sonner';
import { exportToCSV } from '@/common/utils/export-to-csv';
import {
  fetchAllBusinessReports,
  formatBusinessReportsForCsv,
} from '@/domains/business-reports/utils';
import { useMutation } from '@tanstack/react-query';
import { BusinessReportsFilterParams } from '@/domains/business-reports/fetchers';
import { TCustomer } from '@/domains/customer/fetchers';

const useExportCSVMutation = ({
  reportQuery,
  customer,
  fullName,
  firstName,
}: {
  reportQuery: BusinessReportsFilterParams;
  customer: TCustomer | undefined | null;
  fullName: string | undefined;
  firstName: string | undefined;
}) => {
  return useMutation({
    mutationFn: async () => {
      const allData = await fetchAllBusinessReports(reportQuery);
      const csvData = formatBusinessReportsForCsv(allData);

      const clientName = customer?.displayName || 'Unknown';
      const username = fullName || firstName || 'Unknown';
      const now = dayjs().format('YYYY-MM-DDTHH-mm-ss');

      exportToCSV(
        csvData as unknown as Record<string, unknown>[],
        `merchant-monitoring-export-${clientName}-${username}-${now}`,
      );
    },
    onError: error => {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    },
  });
};

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  const demoError = customer?.config?.demoAccessDetails
    ? getDemoStateErrorText({
        reportsLeft: customer.config.demoAccessDetails.reportsLeft,
        demoDaysLeft: customer.config.demoAccessDetails.demoDaysLeft,
      })
    : null;
  const createBusinessReport = {
    ...customer?.features?.createBusinessReport,
    enabled: customer?.features?.createBusinessReport?.enabled && !demoError,
  };
  const createBusinessReportBatch = {
    ...customer?.features?.createBusinessReportBatch,
    enabled: customer?.features?.createBusinessReportBatch?.enabled && !demoError,
  };

  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};

  const { search, debouncedSearch, onSearch } = useSearch();

  const [
    {
      page,
      pageSize,
      sortBy,
      sortDir,
      reportType,
      riskLevels,
      statuses,
      from,
      to,
      findings,
      isAlert,
      isCreating,
      allowAllDates,
    },
    setSearchParams,
  ] = useZodSearchParams(MerchantMonitoringSearchSchema, { replace: true });

  useEffect(() => {
    if (from || to || !customer || allowAllDates) {
      return;
    }

    if (!customer.config?.demoAccessDetails) {
      setSearchParams({
        from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        to: dayjs().format('YYYY-MM-DD'),
      });
    }
  }, []);

  const open = isCreating ?? false;
  const toggleOpen = (value?: boolean) => setSearchParams({ isCreating: value });

  const { findings: findingsOptions, isLoading: isLoadingFindings } = useFindings();

  const reportQuery = {
    ...(reportType !== 'All' && {
      reportType:
        DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE[
          reportType as keyof typeof DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE
        ],
    }),
    search: debouncedSearch,
    page,
    pageSize,
    sortBy,
    sortDir,
    findings,
    riskLevels: riskLevels ?? [],
    statuses: statuses
      ?.map(status => REPORT_STATUS_LABEL_TO_VALUE_MAP[status])
      .flatMap(status =>
        status === 'in-progress' ? ['in-progress', 'quality-control', 'failed'] : [status],
      ) as TReportStatusValue[],
    from,
    to: to ? dayjs(to).add(1, 'day').format('YYYY-MM-DD') : undefined,
    ...(isAlert !== 'All' && { isAlert: DISPLAY_TEXT_TO_IS_ALERT[isAlert] }),
  };

  const { data, isLoading: isLoadingBusinessReports } = useBusinessReportsQuery(reportQuery);

  const { mutate: onExportMautation, isLoading: isExportingReport } = useExportCSVMutation({
    reportQuery,
    customer,
    fullName,
    firstName,
  });

  const isClearAllButtonVisible = useMemo(
    () =>
      !!(
        search !== '' ||
        from ||
        to ||
        reportType !== 'All' ||
        statuses.length ||
        riskLevels.length ||
        findings.length
      ),
    [findings.length, from, reportType, riskLevels.length, search, statuses.length, to],
  );

  const onReportTypeChange = (reportType: keyof typeof REPORT_TYPE_TO_DISPLAY_TEXT) => {
    setSearchParams({ reportType: REPORT_TYPE_TO_DISPLAY_TEXT[reportType] });
  };

  const onIsAlertChange = (isAlert: keyof typeof IS_ALERT_TO_DISPLAY_TEXT) => {
    setSearchParams({ isAlert: IS_ALERT_TO_DISPLAY_TEXT[isAlert] });
  };

  const handleFilterChange = useCallback(
    (filterKey: string) => (selected: unknown) => {
      setSearchParams({
        [filterKey]: Array.isArray(selected) ? selected : [selected],
        page: '1',
      });
    },
    [setSearchParams],
  );

  const handleFilterClear = useCallback(
    (filterKey: string) => () => {
      setSearchParams({
        [filterKey]: [],
        page: '1',
      });
    },
    [setSearchParams],
  );

  const onClearAllFilters = useCallback(() => {
    setSearchParams({
      reportType: 'All',
      riskLevels: [],
      statuses: [],
      findings: [],
      from: undefined,
      to: undefined,
      isAlert: 'All',
      page: '1',
    });

    onSearch('');
  }, [onSearch, setSearchParams]);

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.totalPages ?? 0,
  });

  const dates = useMemo(
    () => ({
      from: from ? dayjs(from).toDate() : undefined,
      to: to ? dayjs(to).toDate() : undefined,
    }),
    [from, to],
  );

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ from, to, allowAllDates: !from && !to });
  };

  const multiselectProps = useMemo(
    () => ({
      trigger: {
        leftIcon: <SlidersHorizontal className="mr-2 h-4 w-4" />,
        title: {
          className: `font-normal text-sm`,
        },
      },
    }),
    [],
  );

  const FINDINGS_FILTER = useMemo(
    () => ({
      title: 'Findings',
      accessor: 'findings',
      options: findingsOptions,
    }),
    [findingsOptions],
  );

  return {
    totalPages: data?.totalPages || 0,
    totalItems: Intl.NumberFormat(locale).format(data?.totalItems || 0),
    createBusinessReport,
    createBusinessReportBatch,
    businessReports: data?.data || [],
    isLoadingBusinessReports,
    isLoadingFindings,
    isClearAllButtonVisible,
    search,
    onSearch,
    page,
    onPrevPage,
    onNextPage,
    onLastPage,
    onPaginate,
    isLastPage,
    locale,
    reportType,
    onReportTypeChange,
    multiselectProps,
    REPORT_TYPE_TO_DISPLAY_TEXT,
    RISK_LEVEL_FILTER,
    STATUS_LEVEL_FILTER,
    FINDINGS_FILTER,
    handleFilterChange,
    handleFilterClear,
    riskLevels,
    statuses,
    findings,
    isAlert,
    IS_ALERT_TO_DISPLAY_TEXT,
    dates,
    onDatesChange,
    onIsAlertChange,
    onClearAllFilters,
    firstName,
    fullName,
    avatarUrl,
    open,
    toggleOpen,
    isDemoAccount: customer?.config?.isDemoAccount ?? false,
    onExport: () => onExportMautation(),
    isExportingReport,
  };
};
