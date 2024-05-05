export const SEVEN_DAYS = 7;
export const TWENTY_ONE_DAYS = 21;

export const daysToMinutesConverter = (days: number) => days * 24 * 60;

export const ALERT_DEDUPE_STRATEGY_DEFAULT = {
  mute: false,
  cooldownTimeframeInMinutes: daysToMinutesConverter(SEVEN_DAYS),
};

export const AlertExecutionStatus = {
  SUCCEEDED: 'SUCCEEDED',
  SKIPPED: 'SKIPPED',
  FAILED: 'FAILED',
} as const;

export const TransactionAlertLabel = {
  PAY_HCA_APM: 'PAY_HCA_APM',
  SHCAC_C: 'SHCAC_C',
  CHCR_C: 'CHCR_C',
  CHVC_C: 'CHVC_C',
  STRUC_APM: 'STRUC_APM',
  PAY_HCA_CC: 'PAY_HCA_CC',
  STRUC_CC: 'STRUC_CC',
  TLHAICC: 'TLHAICC',
  TLHAIAPM: 'TLHAIAPM',
  HACI_APM: 'HACI_APM',
  HCAI_CC: 'HCAI_CC',
  HVIC_APM: 'HVIC_APM',
  HVIC_CC: 'HVIC_CC',
  SHCAR_C: 'SHCAR_C',
  HPC: 'HPC',
} as const;

export const MerchantAlertLabel = {
  MERCHANT_ONGOING_RISK_ALERT: 'MERCHANT_ONGOING_RISK_ALERT',
} as const;
