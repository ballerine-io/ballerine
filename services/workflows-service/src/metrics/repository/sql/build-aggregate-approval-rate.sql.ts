import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildAggregateApprovalRateQuery = (
  fromDate: Date = new Date(),
  projectIds: TProjectIds,
) => Prisma.sql`
SELECT
  (CASE
    WHEN counts."resolvedCount" > 0 AND counts."approvedCount" > 0
    THEN (counts."approvedCount"::int / counts."resolvedCount"::int * 100)
    ELSE 0
  END)::numeric(5, 2)::varchar AS "approvalRate"
FROM (
  SELECT
    (SELECT COUNT(*)
     FROM "WorkflowRuntimeData"
     WHERE "resolvedAt" >= ${fromDate}
       AND "projectId" in (${projectIds?.join(',')})) AS "resolvedCount",
    (SELECT COUNT(*)
     FROM "WorkflowRuntimeData"
     WHERE context -> 'documents' @> '[{"decision": {"status": "approved"}}]'
       AND "resolvedAt" >= ${fromDate}
       AND "projectId" in (${projectIds?.join(',')})) AS "approvedCount"
) AS counts;
`;
