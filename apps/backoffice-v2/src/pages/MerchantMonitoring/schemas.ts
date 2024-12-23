import { z } from 'zod';
import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { BooleanishRecordSchema } from '@ballerine/ui';

export const REPORT_TYPE_TO_DISPLAY_TEXT = {
  All: 'All',
  MERCHANT_REPORT_T1: 'Onboarding',
  ONGOING_MERCHANT_REPORT_T1: 'Monitoring',
} as const;

export const DISPLAY_TEXT_TO_MERCHANT_REPORT_TYPE = {
  All: 'All',
  Onboarding: 'MERCHANT_REPORT_T1',
  Monitoring: 'ONGOING_MERCHANT_REPORT_T1',
} as const;

export const RISK_LEVELS = ['critical', 'high', 'medium', 'low'] as const;

export type TRiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LEVEL_FILTER = {
  title: 'Risk Level',
  accessor: 'riskLevel',
  options: RISK_LEVELS.map(riskLevel => ({
    label: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1),
    value: riskLevel,
  })),
};

export const REPORT_STATUS_OPTIONS = [
  'In Progress',
  'Quality Control',
  'Ready for Review',
] as const;
export const REPORT_STATUS_OPTIONS_WITH_FAILED = [...REPORT_STATUS_OPTIONS, 'Failed'] as const;
export const REPORT_STATUS_TRANSLATIONS = {
  'In Progress': 'in-progress',
  'Quality Control': 'quality-control',
  'Ready for Review': 'completed',
  Failed: 'failed',
} as const;

export type TReportStatusOptions = (typeof REPORT_STATUS_OPTIONS)[number];
export type TReportStatusOptionsWithFailed = (typeof REPORT_STATUS_OPTIONS_WITH_FAILED)[number];
export type TReportStatusTranslations =
  (typeof REPORT_STATUS_TRANSLATIONS)[keyof typeof REPORT_STATUS_TRANSLATIONS];

export const STATUS_LEVEL_FILTER = {
  title: 'Status',
  accessor: 'statuses',
  options: REPORT_STATUS_OPTIONS.map(status => ({
    label: status,
    value: status,
  })),
};

export const FindingsSchema = z.array(z.object({ value: z.string(), title: z.string() }));

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
    .enum([
      ...(Object.values(REPORT_TYPE_TO_DISPLAY_TEXT) as [
        (typeof REPORT_TYPE_TO_DISPLAY_TEXT)['All'],
        ...Array<(typeof REPORT_TYPE_TO_DISPLAY_TEXT)[keyof typeof REPORT_TYPE_TO_DISPLAY_TEXT]>,
      ]),
    ])
    .catch('All'),
  riskLevel: z
    .array(z.enum(RISK_LEVELS.map(riskLevel => riskLevel) as [TRiskLevel, ...TRiskLevel[]]))
    .catch([]),
  statuses: z
    .array(
      z.enum(
        REPORT_STATUS_OPTIONS.map(status => status) as [
          TReportStatusOptions,
          ...TReportStatusOptions[],
        ],
      ),
    )
    .catch([]),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});
