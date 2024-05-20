import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';

export const useMerchantMonitoringLogic = () => {
  const { data: businessReports, isLoading: isloadingBusinessReports } = useBusinessReportsQuery({
    reportType: 'MERCHANT_REPORT_T1',
  });

  return {
    businessReports,
    isloadingBusinessReports,
    page: 1,
    onPrevPage: () => {},
    onNextPage: () => {},
    onPaginate: () => {},
    isLastPage: false,
  };
};
