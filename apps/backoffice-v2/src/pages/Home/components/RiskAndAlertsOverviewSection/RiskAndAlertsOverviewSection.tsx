import { StatsCard } from '@/pages/Home/components/StatsCard/StatsCard';
import { PieChartCard } from '../PieChartCard/PieChartCard';

export const RiskAndAlertsOverviewSection = () => {
  const activeCasesByRiskLevelData = [
    { riskLevel: 'Low', count: 76 },
    { riskLevel: 'Medium', count: 17 },
    { riskLevel: 'High', count: 32 },
    { riskLevel: 'Critical', count: 34 },
  ];
  const approvedCasesByRiskLevelData = [
    { riskLevel: 'Low', count: 45 },
    { riskLevel: 'Medium', count: 12 },
    { riskLevel: 'High', count: 8 },
    { riskLevel: 'Critical', count: 3 },
  ];

  return (
    <>
      <h3 className={'text-xl font-medium'}>Risk and Alerts Overview</h3>

      <div className="grid grid-cols-5 gap-6">
        <PieChartCard
          title="Active Cases by Risk Level"
          centeredTitle={false}
          data={activeCasesByRiskLevelData}
          getDefinition={riskLevel => {
            const riskLevelMap = {
              Low: { color: '#4CAF50', text: 'Low' },
              Medium: { color: '#FFB74D', text: 'Medium' },
              High: { color: '#FF9800', text: 'High' },
              Critical: { color: '#F44336', text: 'Critical' },
            };

            return riskLevelMap[riskLevel] || { color: '#65AFFF', text: riskLevel };
          }}
          nameKey="riskLevel"
          config={activeCasesByRiskLevelData.reduce((acc, curr) => {
            const riskLevelMap = {
              Low: { color: '#4CAF50' },
              Medium: { color: '#FFB74D' },
              High: { color: '#FF9800' },
              Critical: { color: '#F44336' },
            };

            return {
              ...acc,
              [curr.riskLevel]: {
                label: curr.riskLevel,
                color: riskLevelMap[curr.riskLevel]?.color || '#65AFFF',
              },
            };
          }, {})}
        />

        <PieChartCard
          title="Approved Cases by Risk Level"
          centeredTitle={false}
          data={approvedCasesByRiskLevelData}
          getDefinition={riskLevel => {
            const riskLevelMap = {
              Low: { color: '#4CAF50', text: 'Low' },
              Medium: { color: '#FFB74D', text: 'Medium' },
              High: { color: '#FF9800', text: 'High' },
              Critical: { color: '#F44336', text: 'Critical' },
            };

            return riskLevelMap[riskLevel] || { color: '#65AFFF', text: riskLevel };
          }}
          nameKey="riskLevel"
          config={approvedCasesByRiskLevelData.reduce((acc, curr) => {
            const riskLevelMap = {
              Low: { color: '#4CAF50' },
              Medium: { color: '#FFB74D' },
              High: { color: '#FF9800' },
              Critical: { color: '#F44336' },
            };

            return {
              ...acc,
              [curr.riskLevel]: {
                label: curr.riskLevel,
                color: riskLevelMap[curr.riskLevel]?.color || '#65AFFF',
              },
            };
          }, {})}
        />

        <StatsCard
          centered={true}
          alert={true}
          title="Unresolved Individuals Sanction Screening Alerts"
          description="Currently unresolved sanctions screening matches"
          value={7}
        />

        <StatsCard
          centered={true}
          alert={true}
          title="Unresolved WP Ongoing Monitoring Alerts"
          description="Currently unresolved web presence ongoing monitoring alerts"
          value={12}
        />

        <StatsCard
          centered={true}
          alert={true}
          title="Unresolved Transaction Monitoring Alerts"
          description="Currently unresolved transaction monitoring alerts"
          value={28}
        />
      </div>
    </>
  );
};
