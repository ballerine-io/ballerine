import { Type } from '@sinclair/typebox';

export const ReportsByRiskLevelSchema = Type.Object({
  low: Type.Number(),
  medium: Type.Number(),
  high: Type.Number(),
  critical: Type.Number(),
});

export const HomeMetricsSchema = Type.Object({
  riskIndicators: Type.Array(
    Type.Object({
      name: Type.String(),
      count: Type.Number(),
    }),
  ),
  reports: Type.Object({
    all: ReportsByRiskLevelSchema,
    inProgress: ReportsByRiskLevelSchema,
    approved: ReportsByRiskLevelSchema,
  }),
});
