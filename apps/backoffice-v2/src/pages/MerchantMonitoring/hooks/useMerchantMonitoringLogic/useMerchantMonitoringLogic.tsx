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
  RISK_LEVEL_FILTERS,
  STATUS_LEVEL_FILTERS,
} from '@/pages/MerchantMonitoring/schemas';

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  const { search, debouncedSearch, onSearch } = useSearch();

  const [
    { page, pageSize, sortBy, sortDir, reportType, riskLevel, statuses, from, to },
    setSearchParams,
  ] = useZodSearchParams(MerchantMonitoringSearchSchema);

  const { findings } = useFindings();

  const { data, isLoading: isLoadingBusinessReports } = useBusinessReportsQuery({
    reportType:
      DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE[
        reportType as keyof typeof DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE
      ],
    search: debouncedSearch,
    page,
    pageSize,
    sortBy,
    sortDir,
    riskLevel: riskLevel ?? [],
    statuses: statuses ?? [],
    from,
    to,
  });

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

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.totalPages ?? 0,
  });

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = dayjs(range?.from).format('YYYY-MM-DD');
    const to = dayjs(range?.to).format('YYYY-MM-DD');

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

  return {
    totalPages: data?.totalPages || 0,
    totalItems: data?.totalItems || 0,
    createBusinessReport: customer?.features?.createBusinessReport,
    createBusinessReportBatch: customer?.features?.createBusinessReportBatch,
    businessReports: data?.data || [],
    isLoadingBusinessReports,
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
    RISK_LEVEL_FILTERS,
    STATUS_LEVEL_FILTERS,
    handleFilterChange,
    handleFilterClear,
    riskLevel,
    statuses,
    dates: { from, to },
    onDatesChange,
  };
};
