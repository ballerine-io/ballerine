import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisSheet';
import { useTransactionMonitoringAlertsAnalysisPageLogic } from '@/pages/TransactionMonitoringAlertsAnalysis/hooks/useTransactionMonitoringAlertsAnalysisPageLogic/useTransactionMonitoringAlertsAnalysisPageLogic';
import { titleCase } from 'string-ts';

export const TransactionMonitoringAlertsAnalysisPage = () => {
  const { transactions, onNavigateBack, alertDefinition } =
    useTransactionMonitoringAlertsAnalysisPageLogic();

  return (
    <AlertAnalysisSheet
      transactions={transactions ?? []}
      onOpenStateChange={onNavigateBack}
      heading={titleCase(alertDefinition?.name ?? '')}
      summary={titleCase(alertDefinition?.description ?? '')}
    />
  );
};
