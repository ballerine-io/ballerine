import dayjs from 'dayjs';
import { SlidersHorizontal } from 'lucide-react';
import React, { useCallback, ComponentProps, useMemo } from 'react';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useFindings } from '@/pages/MerchantMonitoring/hooks/useFindings/useFindings';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import {
  DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE,
  MerchantMonitoringSearchSchema,
  REPORT_TYPE_TO_DISPLAY_TEXT,
  RISK_LEVEL_FILTER,
  STATUS_LEVEL_FILTER,
  REPORT_STATUS_LABEL_TO_VALUE_MAP,
} from '@/pages/MerchantMonitoring/schemas';

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  const { search, debouncedSearch, onSearch } = useSearch();

  const [
    { page, pageSize, sortBy, sortDir, reportType, riskLevels, statuses, from, to, findings },
    setSearchParams,
  ] = useZodSearchParams(MerchantMonitoringSearchSchema, { replace: true });

  const { findings: findingsOptions, isLoading: isLoadingFindings } = useFindings();

  const { data, isLoading: isLoadingBusinessReports } = useBusinessReportsQuery({
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
      .flatMap(status => (status === 'quality-control' ? ['quality-control', 'failed'] : [status])),
    from,
    to: to ? dayjs(to).add(1, 'day').format('YYYY-MM-DD') : undefined,
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
      page: '1',
    });

    onSearch('');
  }, [onSearch, setSearchParams]);

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.totalPages ?? 0,
  });

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ from, to });
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
    totalItems: data?.totalItems || 0,
    createBusinessReport: customer?.features?.createBusinessReport,
    createBusinessReportBatch: customer?.features?.createBusinessReportBatch,
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
    dates: { from, to },
    onDatesChange,
    onClearAllFilters,
  };
};
