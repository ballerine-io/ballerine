import { Severity, SeverityType } from '@/consts';

export const getSeverityFromRiskScore = (
  riskScore: number | null | undefined,
): SeverityType | undefined => {
  if (!riskScore && riskScore !== 0) {
    return;
  }

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
