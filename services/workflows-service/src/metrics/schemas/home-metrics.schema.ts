import { BusinessReportStatus } from '@prisma/client';
import { Type } from '@sinclair/typebox';

export const ReportsByRiskLevelSchema = Type.Object({
  low: Type.Number(),
  medium: Type.Number(),
  high: Type.Number(),
  critical: Type.Number(),
});


export const ReportStatusesCountSchema = Type.Object({
  [BusinessReportStatus.new]: Type.Optional(Type.Number()),
  [BusinessReportStatus.in_progress]: Type.Optional(Type.Number()),
  [BusinessReportStatus.completed]: Type.Optional(Type.Number()),
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
    inProgress: ReportStatusesCountSchema,
    approved: ReportsByRiskLevelSchema,
  }),
});
