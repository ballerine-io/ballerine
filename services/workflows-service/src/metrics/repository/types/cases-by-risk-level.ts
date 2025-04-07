import type { WorkflowRuntimeDataStatus } from '@prisma/client';

export interface ICasesByRiskLevelAggregationResult {
  count: number;
  risk_level: WorkflowRuntimeDataStatus;
}
