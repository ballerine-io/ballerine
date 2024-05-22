import { OngoingMonitoringRiskSheet } from '@/pages/BusinessesAlertsAnalysis/components/OngoingMonitoringRiskSheet';
import { useBusinessAlertsAnalysisLogic } from '@/pages/BusinessesAlertsAnalysis/hooks/useBusinessAlertsAnalysisLogic/useBusinessAlertsAnalysisLogic';

export const BusinessesAlertsAnalysisPage = () => {
  const { businessReports, onNavigateBack } = useBusinessAlertsAnalysisLogic();

  return (
    <OngoingMonitoringRiskSheet
      businessReports={businessReports ?? []}
      onOpenStateChange={onNavigateBack}
    />
  );
};
