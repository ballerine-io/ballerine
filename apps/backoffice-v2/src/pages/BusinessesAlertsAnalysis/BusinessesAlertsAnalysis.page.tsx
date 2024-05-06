import { useTransactionMonitoringAlertsAnalysisPageLogic } from '@/pages/TransactionMonitoringAlertsAnalysis/hooks/useTransactionMonitoringAlertsAnalysisPageLogic/useTransactionMonitoringAlertsAnalysisPageLogic';
import { OngoingMonitoringRiskSheet } from '@/pages/BusinessesAlertsAnalysis/components/OngoingMonitoringRiskSheet';

export const BusinessesAlertsAnalysisPage = () => {
  const { transactions, onNavigateBack, alertDefinition, isLoadingAlertDefinition, alertId } =
    useTransactionMonitoringAlertsAnalysisPageLogic();

  return (
    <OngoingMonitoringRiskSheet
      key={alertId}
      transactions={transactions ?? []}
      onOpenStateChange={onNavigateBack}
    />
  );
};
