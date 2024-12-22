import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useFindings } from '@/pages/MerchantMonitoring/hooks/useFindings/useFindings';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { MerchantMonitoringSearchSchema } from '@/pages/MerchantMonitoring/merchant-monitoring-search-schema';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import { ComponentProps } from 'react';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import dayjs from 'dayjs';

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  const { search, debouncedSearch, onSearch } = useSearch();
  const [{ page, pageSize, sortBy, sortDir, from, to }, setSearchParams] = useZodSearchParams(
    MerchantMonitoringSearchSchema,
  );

  const { findings } = useFindings();

  const { data, isLoading: isLoadingBusinessReports } = useBusinessReportsQuery({
    reportType: 'MERCHANT_REPORT_T1',
    search: debouncedSearch,
    page,
    pageSize,
    sortBy,
    sortDir,
    from,
    to,
  });

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.totalPages ?? 0,
  });

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = dayjs(range?.from).format('YYYY-MM-DD');
    const to = dayjs(range?.to).format('YYYY-MM-DD');

    setSearchParams({ from, to });
  };

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
    dates: { from, to },
    onDatesChange,
  };
};
