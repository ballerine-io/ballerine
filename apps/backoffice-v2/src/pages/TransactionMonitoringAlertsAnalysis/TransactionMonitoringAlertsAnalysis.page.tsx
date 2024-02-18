import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet';
import { useTransactionsQuery } from '@/domains/transactions/hooks/queries/useTransactionsQuery/useTransactionsQuery';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNavigateBack } from '@/common/hooks/useNavigateBack/useNavigateBack';
import { useNavigate } from 'react-router-dom';

export const TransactionMonitoringAlertsAnalysisPage = () => {
  const [{ businessId }] = useSerializedSearchParams();
  const { data: transactions } = useTransactionsQuery({
    businessId: businessId ?? '',
  });
  const navigateBack = useNavigateBack();
  const navigate = useNavigate();
  const onNavigateBack = () => {
    if (window.history.state.idx <= 1) {
      navigate('../');

      return;
    }

    navigateBack();
  };

  return (
    <AlertAnalysisSheet transactions={transactions ?? []} onOpenStateChange={onNavigateBack} />
  );
};
