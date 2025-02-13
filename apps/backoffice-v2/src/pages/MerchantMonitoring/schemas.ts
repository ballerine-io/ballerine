import { z } from 'zod';
import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { BooleanishRecordSchema } from '@ballerine/ui';
import dayjs from 'dayjs';

export const REPORT_TYPE_TO_DISPLAY_TEXT = {
  All: 'All',
  MERCHANT_REPORT_T1: 'Onboarding',
  ONGOING_MERCHANT_REPORT_T1: 'Monitoring',
} as const;

export const IS_ALERT_TO_DISPLAY_TEXT = {
  All: 'All',
  true: 'Alerted',
  false: 'Not Alerted',
} as const;

export const DISPLAY_TEXT_TO_IS_ALERT = {
  All: 'All',
  Alerted: true,
  'Not Alerted': false,
} as const;

export const DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE = {
  Onboarding: 'MERCHANT_REPORT_T1',
  Monitoring: 'ONGOING_MERCHANT_REPORT_T1',
} as const;

export const RISK_LEVELS_MAP = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
};

export const RISK_LEVELS = [
  RISK_LEVELS_MAP.low,
  RISK_LEVELS_MAP.medium,
  RISK_LEVELS_MAP.high,
  RISK_LEVELS_MAP.critical,
] as const;

export type TRiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LEVEL_FILTER = {
  title: 'Risk Level',
  accessor: 'riskLevels',
  options: RISK_LEVELS.map(riskLevel => ({
    label: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1),
    value: riskLevel,
  })),
};

export const REPORT_STATUS_LABELS = ['In Progress', 'Ready for Review'] as const;

export const REPORT_STATUS_LABEL_TO_VALUE_MAP = {
  'In Progress': 'in-progress',
  'Ready for Review': 'completed',
} as const;

export type TReportStatusLabel = (typeof REPORT_STATUS_LABELS)[number];

export type TReportStatusValue =
  (typeof REPORT_STATUS_LABEL_TO_VALUE_MAP)[keyof typeof REPORT_STATUS_LABEL_TO_VALUE_MAP];

export const STATUS_LEVEL_FILTER = {
  title: 'Status',
  accessor: 'statuses',
  options: REPORT_STATUS_LABELS.map(status => ({
    label: status,
    value: status,
  })),
};

export const FindingsSchema = z.array(z.object({ value: z.string(), label: z.string() }));

export const MerchantMonitoringSearchSchema = BaseSearchSchema.extend({
  sortBy: z
    .enum([
      'createdAt',
      'updatedAt',
      'business.website',
      'business.companyName',
      'business.country',
      'riskScore',
      'status',
      'reportType',
    ] as const satisfies ReadonlyArray<
      | Extract<
          keyof NonNullable<TBusinessReport>,
          'createdAt' | 'updatedAt' | 'riskScore' | 'status' | 'reportType'
        >
      | 'business.website'
      | 'business.companyName'
      | 'business.country'
    >)
    .catch('createdAt'),
  selected: BooleanishRecordSchema.optional(),
  reportType: z
    .enum(
      Object.values(REPORT_TYPE_TO_DISPLAY_TEXT) as [
        (typeof REPORT_TYPE_TO_DISPLAY_TEXT)['All'],
        ...Array<(typeof REPORT_TYPE_TO_DISPLAY_TEXT)[keyof typeof REPORT_TYPE_TO_DISPLAY_TEXT]>,
      ],
    )
    .catch('All'),
  riskLevels: z
    .array(z.enum(RISK_LEVELS.map(riskLevel => riskLevel) as [TRiskLevel, ...TRiskLevel[]]))
    .catch([]),
  statuses: z
    .array(
      z.enum(
        REPORT_STATUS_LABELS.map(status => status) as [TReportStatusLabel, ...TReportStatusLabel[]],
      ),
    )
    .catch([]),
  findings: z.array(z.string()).catch([]),
  isAlert: z
    .enum(
      Object.values(IS_ALERT_TO_DISPLAY_TEXT) as [
        (typeof IS_ALERT_TO_DISPLAY_TEXT)['All'],
        ...Array<(typeof IS_ALERT_TO_DISPLAY_TEXT)[keyof typeof IS_ALERT_TO_DISPLAY_TEXT]>,
      ],
    )
    .catch('All'),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

const URL_REGEX =
  /((https?):\/\/)?([a-zA-Z0-9-_]+\.)+[a-zA-Z0-9]+(\.[a-z]{2})?(\/[a-zA-Z0-9_#-]+)*(\/)?(\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?/;

export type CreateBusinessReportDialogInput = z.input<typeof CreateBusinessReportDialogSchema>;
export const CreateBusinessReportDialogSchema = z.object({
  websiteUrl: z.string().regex(URL_REGEX, {
    message: 'Invalid website URL',
  }),
  companyName: z
    .string({
      invalid_type_error: 'Company name must be a string',
    })
    .max(255)
    .optional(),
  businessCorrelationId: z
    .string({
      invalid_type_error: 'Business ID must be a string',
    })
    .max(255)
    .optional(),
});
