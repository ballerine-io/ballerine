import { AlertSeverity, TAlertSeverity } from '@/domains/alerts/fetchers';

export const getSeverityFromRiskScore = (riskScore: number): TAlertSeverity => {
  if (riskScore <= 39) {
    return AlertSeverity.LOW;
  }

  if (riskScore <= 69) {
    return AlertSeverity.MEDIUM;
  }

  if (riskScore <= 84) {
    return AlertSeverity.HIGH;
  }

  return AlertSeverity.HIGH;
};
