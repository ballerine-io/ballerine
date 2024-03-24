import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlertDefinitionByAlertIdQuery } from '@/domains/alerts/hooks/queries/useAlertDefinitionByAlertIdQuery/useAlertDefinitionByAlertIdQuery';
import { useTransactionsQuery } from '@/domains/transactions/hooks/queries/useTransactionsQuery/useTransactionsQuery';
import { useNavigateBack } from '@/common/hooks/useNavigateBack/useNavigateBack';
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
  const navigateBack = useNavigateBack();
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const isFirstPageInHistory = window.history.state.idx <= 1;

    if (isFirstPageInHistory) {
      navigate('../');

      return;
    }

    navigateBack();
    navigateBack();
  }, [navigate, navigateBack]);

  return {
    transactions,
    onNavigateBack,
    alertDefinition,
    isLoadingAlertDefinition,
    alertId,
  };
};
