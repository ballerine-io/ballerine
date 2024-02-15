import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet';
import { useTransactionsQuery } from '@/domains/transactions/hooks/queries/useTransactionsQuery/useTransactionsQuery';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigateBack = () => {
  const navigate = useNavigate();
  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return navigateBack;
};

export const TransactionMonitoringAlertsAnalysisPage = () => {
  const [{ businessId }] = useSerializedSearchParams();
  const { data: transactions } = useTransactionsQuery({
    businessId: businessId ?? '',
  });
  const isSheetOpen = true;
  const navigateBack = useNavigateBack();

  return (
    <AlertAnalysisSheet
      transactions={transactions ?? []}
      isOpen={isSheetOpen}
      onOpenStateChange={navigateBack}
    />
  );
};
