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

export const RISK_LEVELS = ['Critical', 'High', 'Medium', 'Low'] as const;

export type TRiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LEVEL_FILTER = {
  title: 'Risk Level',
  accessor: 'riskLevel',
  options: RISK_LEVELS.map(riskLevel => ({
    label: riskLevel,
    value: riskLevel.toLowerCase(),
  })),
};

export const REPORT_STATUS = ['In Progress', 'Quality Control', 'Manual Review'] as const;

export type TReportStatus = (typeof REPORT_STATUS)[number];

export const STATUS_LEVEL_FILTER = {
  title: 'Status',
  accessor: 'status',
  options: REPORT_STATUS.map(status => ({
    label: status,
    value: status.toLowerCase(),
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
    .array(
      z.enum(
        RISK_LEVELS.map(riskLevel => riskLevel.toLowerCase()) as [TRiskLevel, ...TRiskLevel[]],
      ),
    )
    .catch([]),
  statuses: z
    .array(
      z.enum(
        REPORT_STATUS.map(status => status.toLowerCase()) as [TReportStatus, ...TReportStatus[]],
      ),
    )
    .catch([]),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});
