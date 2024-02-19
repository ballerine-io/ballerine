import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlertDefinitionByAlertIdQuery } from '@/domains/alert-definitions/hooks/queries/useAlertDefinitionByAlertIdQuery/useAlertDefinitionByAlertIdQuery';
import { useTransactionsQuery } from '@/domains/transactions/hooks/queries/useTransactionsQuery/useTransactionsQuery';
import { useNavigateBack } from '@/common/hooks/useNavigateBack/useNavigateBack';

export const useTransactionMonitoringAlertsAnalysisPageLogic = () => {
  const [{ businessId }] = useSerializedSearchParams();
  const { alertId } = useParams();
  const { data: alertDefinition } = useAlertDefinitionByAlertIdQuery({
    alertId: alertId ?? '',
  });
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

  return {
    transactions,
    onNavigateBack,
    alertDefinition,
  };
};
