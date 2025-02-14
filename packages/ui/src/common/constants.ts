import { MERCHANT_REPORT_RISK_LEVELS_MAP, MerchantReportRiskLevel } from '@ballerine/common';

type SeverityToClassName = Record<MerchantReportRiskLevel, string>;

export const severityToTextClassName = {
  [MERCHANT_REPORT_RISK_LEVELS_MAP.high]: 'text-destructive',
  [MERCHANT_REPORT_RISK_LEVELS_MAP.medium]: 'text-orange-300',
  [MERCHANT_REPORT_RISK_LEVELS_MAP.low]: 'text-success',
  [MERCHANT_REPORT_RISK_LEVELS_MAP.critical]: 'text-background',
} as const satisfies SeverityToClassName;

export const severityToClassName = {
  [MERCHANT_REPORT_RISK_LEVELS_MAP.high]: `bg-destructive/20 ${severityToTextClassName.high}`,
  [MERCHANT_REPORT_RISK_LEVELS_MAP.medium]: `bg-orange-100 ${severityToTextClassName.medium}`,
  [MERCHANT_REPORT_RISK_LEVELS_MAP.low]: `bg-success/20 ${severityToTextClassName.low}`,
  [MERCHANT_REPORT_RISK_LEVELS_MAP.critical]: `bg-destructive ${severityToTextClassName.critical}`,
} as const satisfies SeverityToClassName;
