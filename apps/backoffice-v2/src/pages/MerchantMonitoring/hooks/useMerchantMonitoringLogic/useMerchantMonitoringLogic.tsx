import dayjs from 'dayjs';
import { SlidersHorizontal } from 'lucide-react';
import { ComponentProps, useCallback, useEffect, useMemo } from 'react';

import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
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
} from '@/pages/MerchantMonitoring/schemas';
import { useLocation } from 'react-router-dom';
import { MERCHANT_MONITORING_QUERY_PARAMS_KEY } from '@/pages/MerchantMonitoring/constants';

const useDefaultDateRange = () => {
  const [{ from, to }, setSearchParams] = useZodSearchParams(MerchantMonitoringSearchSchema);

  useEffect(() => {
    if (from || to) {
      return;
    }

    setSearchParams({
      from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    });
  }, []);
};

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

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
    },
    setSearchParams,
  ] = useZodSearchParams(MerchantMonitoringSearchSchema, { replace: true });

  const { search: searchString } = useLocation();
  useEffect(() => {
    sessionStorage.setItem(MERCHANT_MONITORING_QUERY_PARAMS_KEY, searchString);
  }, [searchString]);

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
    ...(isAlert !== 'All' && { isAlert: DISPLAY_TEXT_TO_IS_ALERT[isAlert] }),
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

  useDefaultDateRange();

  return {
    totalPages: data?.totalPages || 0,
    totalItems: Intl.NumberFormat(locale).format(data?.totalItems || 0),
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
    isAlert,
    IS_ALERT_TO_DISPLAY_TEXT,
    dates: { from, to },
    onDatesChange,
    onIsAlertChange,
    onClearAllFilters,
  };
};
