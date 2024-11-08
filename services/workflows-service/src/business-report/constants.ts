export const MERCHANT_REPORT_STATUSES_MAP = {
  draft: 'draft',
  'in-progress': 'in-progress',
  completed: 'completed',
  'quality-control': 'quality-control',
  failed: 'failed',
} as const;

export type MerchantReportStatus = keyof typeof MERCHANT_REPORT_STATUSES_MAP;

export const MERCHANT_REPORT_STATUSES = Object.values(MERCHANT_REPORT_STATUSES_MAP);

export const MERCHANT_REPORT_TYPES_MAP = {
  MERCHANT_REPORT_T1: 'MERCHANT_REPORT_T1',
  ONGOING_MERCHANT_REPORT_T1: 'ONGOING_MERCHANT_REPORT_T1',
} as const;

export type MerchantReportType = keyof typeof MERCHANT_REPORT_TYPES_MAP;

export const MERCHANT_REPORT_TYPES = Object.values(MERCHANT_REPORT_TYPES_MAP);

export const MERCHANT_REPORT_VERSIONS_MAP = {
  '1': '1',
  '2': '2',
  '3': '3',
} as const;

export type MerchantReportVersion = keyof typeof MERCHANT_REPORT_VERSIONS_MAP;

export const MERCHANT_REPORT_VERSIONS = Object.values(MERCHANT_REPORT_VERSIONS_MAP);
