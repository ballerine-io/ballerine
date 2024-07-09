import { Severity, TSeverity } from '@/common/types';

export const getSeverityFromRiskScore = (riskScore: number): TSeverity | undefined => {
  if (riskScore <= 39) {
    return Severity.LOW;
  }

  if (riskScore <= 69) {
    return Severity.MEDIUM;
  }

  if (riskScore <= 84) {
    return Severity.HIGH;
  }

  if (riskScore >= 85) {
    return Severity.CRITICAL;
  }
};
