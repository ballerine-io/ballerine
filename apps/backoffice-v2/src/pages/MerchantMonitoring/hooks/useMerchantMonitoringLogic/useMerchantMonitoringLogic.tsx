import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { getMerchantMonitoringSearchSchema } from '@/pages/MerchantMonitoring/get-merchant-monitoring-search-schema';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/useCustomerQuery';

export const useMerchantMonitoringLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();
  const { data: session } = useAuthenticatedUserQuery();
  const MerchantMonitoringSearchSchema = getMerchantMonitoringSearchSchema(session?.user?.id);
  const [{ page, pageSize, sortBy, sortDir }] = useZodSearchParams(MerchantMonitoringSearchSchema);
  const { data: businessReports, isLoading: isLoadingBusinessReports } = useBusinessReportsQuery({
    reportType: 'MERCHANT_REPORT_T1',
    page,
    pageSize,
    sortBy,
    sortDir,
  });
  const { onPaginate, onPrevPage, onNextPage } = usePagination();
  const isLastPage = (businessReports?.length ?? 0) < pageSize || businessReports?.length === 0;

  return {
    disableCreateMerchantMonitoringButton: customer?.config?.disableCreateMerchantMonitoringButton,
    businessReports,
    isLoadingBusinessReports,
    page,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
    locale,
  };
};
