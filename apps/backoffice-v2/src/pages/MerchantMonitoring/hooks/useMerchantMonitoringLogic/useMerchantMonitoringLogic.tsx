import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { getMerchantMonitoringSearchSchema } from '@/pages/MerchantMonitoring/get-merchant-monitoring-search-schema';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/useCustomerQuery';
import { useSearch } from '@/common/hooks/useSearch/useSearch';

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  const MerchantMonitoringSearchSchema = getMerchantMonitoringSearchSchema();

  const [{ page, pageSize, sortBy, sortDir, search: searchParamValue }] = useZodSearchParams(
    MerchantMonitoringSearchSchema,
  );

  const { search: searchTerm, onSearch } = useSearch({
    initialSearch: searchParamValue,
  });

  const search = searchTerm as string;

  const {
    data = { businessReports: [], meta: { totalItems: 0, totalPages: 0 } },
    isLoading: isLoadingBusinessReports,
  } = useBusinessReportsQuery({
    reportType: 'MERCHANT_REPORT_T1',
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
  });

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.meta.totalPages ?? 0,
  });

  return {
    totalPages: data?.meta.totalPages || 0,
    totalItems: data?.meta.totalItems || 0,
    createBusinessReport: customer?.features?.createBusinessReport,
    createBusinessReportBatch: customer?.features?.createBusinessReportBatch,
    businessReports: data?.businessReports || [],
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
  };
};
