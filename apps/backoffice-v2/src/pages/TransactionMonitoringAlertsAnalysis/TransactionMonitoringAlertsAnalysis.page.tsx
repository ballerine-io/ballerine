import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisSheet';
import { useTransactionMonitoringAlertsAnalysisPageLogic } from '@/pages/TransactionMonitoringAlertsAnalysis/hooks/useTransactionMonitoringAlertsAnalysisPageLogic/useTransactionMonitoringAlertsAnalysisPageLogic';
import { titleCase } from 'string-ts';
import { Skeleton } from '@/common/components/atoms/Skeleton/Skeleton';

export const TransactionMonitoringAlertsAnalysisPage = () => {
  const { transactions, onNavigateBack, alertDefinition, isLoadingAlertDefinition } =
    useTransactionMonitoringAlertsAnalysisPageLogic();

  return (
    <AlertAnalysisSheet
      transactions={transactions ?? []}
      onOpenStateChange={onNavigateBack}
      heading={
        <>
          {isLoadingAlertDefinition && <Skeleton className={`h-8 w-[20ch]`} />}
          {!isLoadingAlertDefinition && titleCase(alertDefinition?.name ?? '')}
        </>
      }
      summary={
        <>
          {isLoadingAlertDefinition && <Skeleton className={`h-5 w-[50ch]`} />}
          {!isLoadingAlertDefinition && titleCase(alertDefinition?.description ?? '')}
        </>
      }
    />
  );
};
