import { AlertAnalysisSheet } from 'src/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisSheet';
import { useTransactionsQuery } from '@/domains/transactions/hooks/queries/useTransactionsQuery/useTransactionsQuery';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNavigateBack } from '@/common/hooks/useNavigateBack/useNavigateBack';
import { useNavigate } from 'react-router-dom';

export const TransactionMonitoringAlertsAnalysisPage = () => {
  const [{ businessId }] = useSerializedSearchParams();
  const { data: transactions } = useTransactionsQuery({
    businessId: businessId ?? '',
    page: 1,
    pageSize: 50,
  });
  const navigateBack = useNavigateBack();
  const navigate = useNavigate();
  const onNavigateBack = () => {
    const isFirstPageInHistory = window.history.state.idx <= 1;

    if (isFirstPageInHistory) {
      navigate('../');

      return;
    }

    navigateBack();
  };

  return (
    <AlertAnalysisSheet transactions={transactions ?? []} onOpenStateChange={onNavigateBack} />
  );
};
