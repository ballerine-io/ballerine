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
  getStatusColor,
  getRiskColor,
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
  | 'getStatusColor'
  | 'getRiskColor'
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
            data={casesByStatus}
            getColor={getStatusColor}
            nameKey="status"
            config={statusConfig}
          />

          <PieChartCard
            data={ongoingCasesByRisk}
            getColor={getRiskColor}
            nameKey="riskLevel"
            config={ongoingRiskConfig}
          />

          <PieChartCard
            data={approvedCasesByRisk}
            getColor={getRiskColor}
            nameKey="riskLevel"
            config={approvedRiskConfig}
          />
        </>
      )}
    </div>
  );
};
