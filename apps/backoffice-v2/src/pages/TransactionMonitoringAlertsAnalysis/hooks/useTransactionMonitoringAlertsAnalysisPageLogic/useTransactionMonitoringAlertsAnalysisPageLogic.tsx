import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlertDefinitionByAlertIdQuery } from '@/domains/alerts/hooks/queries/useAlertDefinitionByAlertIdQuery/useAlertDefinitionByAlertIdQuery';
import { useTransactionsQuery } from '@/domains/transactions/hooks/queries/useTransactionsQuery/useTransactionsQuery';
import { useCallback } from 'react';

export const useTransactionMonitoringAlertsAnalysisPageLogic = () => {
  const [{ businessId, counterpartyId }] = useSerializedSearchParams();
  const { alertId } = useParams();
  const { data: alertDefinition, isLoading: isLoadingAlertDefinition } =
    useAlertDefinitionByAlertIdQuery({
      alertId: alertId ?? '',
    });
  const { data: transactions } = useTransactionsQuery({
    businessId: businessId ?? '',
    // @TODO: Remove
    counterpartyId: counterpartyId ?? '',
    page: 1,
    pageSize: 50,
  });
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'transaction-monitoring:transactions-drawer:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('transaction-monitoring:transactions-drawer:previous-path');
  }, [navigate]);

  return {
    transactions,
    onNavigateBack,
    alertDefinition,
    isLoadingAlertDefinition,
    alertId,
  };
};
