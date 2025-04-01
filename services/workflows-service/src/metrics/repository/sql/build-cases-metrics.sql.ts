import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildCasesByStatusQuery = (projectIds: TProjectIds) => Prisma.sql`
SELECT
  state as status,
  COUNT(*) as count
FROM "WorkflowRuntimeData"
WHERE "projectId" IN (${projectIds?.join(',')})
GROUP BY state`;

export const buildCasesByRiskLevelQuery = (projectIds: TProjectIds, status?: string) => Prisma.sql`
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
  ${status ? Prisma.sql`AND state = ${status}` : Prisma.sql``}
GROUP BY risk_level`;
