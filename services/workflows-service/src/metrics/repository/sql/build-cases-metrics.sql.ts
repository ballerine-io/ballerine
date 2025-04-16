import { TProjectIds } from '@/types';
import { Prisma, type WorkflowRuntimeDataStatus } from '@prisma/client';

export const buildCasesByRiskLevelQuery = (
  projectIds: TProjectIds,
  status?: WorkflowRuntimeDataStatus,
) => Prisma.sql`
SELECT
  CASE
    WHEN COALESCE(
      context->'pluginsOutput'->'riskEvaluation'->>'riskScore',
      context->'pluginsOutput'->'risk_evaluation'->>'riskScore'
    )::int <= 39 THEN 'low'
    WHEN COALESCE(
      context->'pluginsOutput'->'riskEvaluation'->>'riskScore',
      context->'pluginsOutput'->'risk_evaluation'->>'riskScore'
    )::int <= 69 THEN 'medium'
    WHEN COALESCE(
      context->'pluginsOutput'->'riskEvaluation'->>'riskScore',
      context->'pluginsOutput'->'risk_evaluation'->>'riskScore'
    )::int <= 84 THEN 'high'
    ELSE 'critical'
  END as risk_level,
  COUNT(*) as count
FROM "WorkflowRuntimeData"
WHERE "projectId" IN (${projectIds?.join(',')})
  ${status ? Prisma.sql`AND status = ${status}::"WorkflowRuntimeDataStatus"` : Prisma.sql``}
  AND (
    context->'pluginsOutput'->'riskEvaluation'->>'riskScore' IS NOT NULL
    OR context->'pluginsOutput'->'risk_evaluation'->>'riskScore' IS NOT NULL
  )
  AND parent_runtime_data_id IS NULL
GROUP BY risk_level`;
