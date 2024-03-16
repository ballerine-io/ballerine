import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisSheet';
import { useTransactionMonitoringAlertsAnalysisPageLogic } from '@/pages/TransactionMonitoringAlertsAnalysis/hooks/useTransactionMonitoringAlertsAnalysisPageLogic/useTransactionMonitoringAlertsAnalysisPageLogic';
import { capitalize, titleCase } from 'string-ts';
import { Skeleton } from '@/common/components/atoms/Skeleton/Skeleton';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { ctw } from '@/common/utils/ctw/ctw';

export const TransactionMonitoringAlertsAnalysisPage = () => {
  const { transactions, onNavigateBack, alertDefinition, isLoadingAlertDefinition, alertId } =
    useTransactionMonitoringAlertsAnalysisPageLogic();

  return (
    <AlertAnalysisSheet
      key={alertId}
      transactions={transactions ?? []}
      onOpenStateChange={onNavigateBack}
      heading={
        <span
          className={ctw({
            'text-slate-400': !alertDefinition?.name,
          })}
        >
          {isLoadingAlertDefinition && <Skeleton className={`h-8 w-[20ch]`} />}
          {!isLoadingAlertDefinition && valueOrNA(titleCase(alertDefinition?.name ?? ''))}
        </span>
      }
      summary={
        <span
          className={ctw({
            'text-slate-400': !alertDefinition?.description,
          })}
        >
          {isLoadingAlertDefinition && <Skeleton className={`h-5 w-[50ch]`} />}
          {!isLoadingAlertDefinition && valueOrNA(capitalize(alertDefinition?.description ?? ''))}
        </span>
      }
    />
  );
};
