import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBusinessAlertsAnalysisLogic = () => {
  const [{ businessId }] = useSerializedSearchParams();
  const { data: businessReports = [] } = useBusinessReportsQuery({
    businessId: (businessId as string) ?? '',
    reportType: 'ONGOING_MERCHANT_REPORT_T1',
  });
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'business-transaction-monitoring:transactions-drawer:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);

    sessionStorage.removeItem('business-transaction-monitoring:transactions-drawer:previous-path');
  }, [navigate]);

  return {
    businessReports,
    onNavigateBack,
  };
};
