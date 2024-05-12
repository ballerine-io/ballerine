import { OngoingMonitoringRiskSheet } from '@/pages/BusinessesAlertsAnalysis/components/OngoingMonitoringRiskSheet';
import { useBusinessAlertsAnalysisLogic } from '@/pages/BusinessesAlertsAnalysis/hooks/useBusinessAlertsAnalysisLogic/useBusinessAlertsAnalysisLogic';

export const BusinessesAlertsAnalysisPage = () => {
  const { businessReports, onNavigateBack } = useBusinessAlertsAnalysisLogic();

  console.log({ businessReports });

  return (
    <OngoingMonitoringRiskSheet
      businessReports={businessReports ?? []}
      onOpenStateChange={onNavigateBack}
    />
  );
};
