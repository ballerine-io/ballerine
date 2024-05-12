import { BusinessAlertSeverity, TBusinessAlertSeverity } from '@/domains/business-alerts/fetchers';

export const getSeverityFromRiskScore = (riskScore: number): TBusinessAlertSeverity => {
  if (riskScore <= 39) {
    return BusinessAlertSeverity.LOW;
  }

  if (riskScore <= 69) {
    return BusinessAlertSeverity.MEDIUM;
  }

  if (riskScore <= 84) {
    return BusinessAlertSeverity.HIGH;
  }

  return BusinessAlertSeverity.HIGH;
};
