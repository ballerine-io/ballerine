import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useGetBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useGetBusinessReportsQuery/useGetBusinessReportsQuery';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBusinessAlertsAnalysisLogic = () => {
  const [{ businessId }] = useSerializedSearchParams();
  const { data: businessReports = [] } = useGetBusinessReportsQuery({
    businessId: (businessId as string) ?? '',
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
