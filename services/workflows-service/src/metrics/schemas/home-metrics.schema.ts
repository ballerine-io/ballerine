import { Type } from '@sinclair/typebox';

export const ReportsByRiskLevelSchema = Type.Object({
  low: Type.Number(),
  medium: Type.Number(),
  high: Type.Number(),
  critical: Type.Number(),
});

// export const ReportStatusesCountSchema = Type.Object({
//   [BusinessReportStatus.new]: Type.Optional(Type.Number()),
//   [BusinessReportStatus.failed]: Type.Optional(Type.Number()),
//   [BusinessReportStatus.in_progress]: Type.Optional(Type.Number()),
//   [BusinessReportStatus.completed]: Type.Optional(Type.Number()),
// });

export const HomeMetricsSchema = Type.Object({
  mccCounts: Type.Array(
    Type.Object({
      mcc: Type.Number(),
      count: Type.Number(),
      percentage: Type.Number(),
      mccDescription: Type.String(),
    }),
  ),
  riskIndicators: Type.Array(
    Type.Object({
      name: Type.String(),
      count: Type.Number(),
    }),
  ),
  reportStatuses: Type.Array(
    Type.Object({
      status: Type.String(),
      count: Type.Number(),
    }),
  ),
  reportsRisks: Type.Object({
    all: ReportsByRiskLevelSchema,
    approved: ReportsByRiskLevelSchema,
  }),
});
