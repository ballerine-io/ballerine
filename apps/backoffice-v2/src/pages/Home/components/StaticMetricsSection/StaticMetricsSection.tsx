import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { PieChartCard } from '@/pages/Home/components/PieChartCard/PieChartCard';
import { StatsCard } from '@/pages/Home/components/StatsCard/StatsCard';

export const StaticMetricsSection = ({
  isOngoingMonitoringEnabled,
  isCasesOnboardingEnabled,

  casesByStatus,
  ongoingCasesByRisk,
  approvedCasesByRisk,
  totalActiveMerchants,

  statusConfig,
  ongoingRiskConfig,
  approvedRiskConfig,
  getStatusDefinition,
  getRiskDefinition,
}: Pick<
  ReturnType<typeof useHomeLogic>,
  | 'isOngoingMonitoringEnabled'
  | 'isCasesOnboardingEnabled'
  | 'casesByStatus'
  | 'ongoingCasesByRisk'
  | 'approvedCasesByRisk'
  | 'totalActiveMerchants'
  | 'statusConfig'
  | 'ongoingRiskConfig'
  | 'approvedRiskConfig'
  | 'getStatusDefinition'
  | 'getRiskDefinition'
>) => {
  return (
    <div className="grid grid-cols-4 gap-6 2xl:grid-cols-6">
      {isOngoingMonitoringEnabled && (
        <StatsCard
          count={totalActiveMerchants}
          centered={true}
          title="Total Active Merchants"
          description="Merchants currently subscribed to monitoring"
        />
      )}

      {isCasesOnboardingEnabled && (
        <>
          <PieChartCard
            title="KYB Cases by Status"
            data={casesByStatus}
            getDefinition={getStatusDefinition}
            nameKey="status"
            config={statusConfig}
          />

          <PieChartCard
            title="Active KYB Cases by Risk Level"
            data={ongoingCasesByRisk}
            getDefinition={getRiskDefinition}
            nameKey="riskLevel"
            config={ongoingRiskConfig}
          />

          <PieChartCard
            title="Approved KYB Cases by Risk Level"
            data={approvedCasesByRisk}
            getDefinition={getRiskDefinition}
            nameKey="riskLevel"
            config={approvedRiskConfig}
          />
        </>
      )}
    </div>
  );
};
