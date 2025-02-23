import { severityToDisplaySeverity } from '@/components/templates/report/constants';

export const toRiskLabels = (riskIndicators: Array<{ name: string; riskLevel: string }>) => {
  if (!Array.isArray(riskIndicators) || !riskIndicators.length) {
    return [];
  }

  return riskIndicators.map(({ name, riskLevel, ...rest }) => ({
    label: name,
    severity:
      severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ?? riskLevel,
  }));
};
