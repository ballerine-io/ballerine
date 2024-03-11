import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildAggregateAverageAssignmentTimeQuery = (
  fromDate: Date = new Date(),
  projectIds: TProjectIds,
) => Prisma.sql`
SELECT AVG(time)::varchar as average_time
FROM (
  SELECT
    COALESCE(
      EXTRACT(EPOCH FROM ("WorkflowRuntimeData"."assignedAt" - "WorkflowRuntimeData"."createdAt")) * 1000,
      0
    ) AS time
  FROM
    "WorkflowRuntimeData"
  WHERE
    "WorkflowRuntimeData"."createdAt" IS NOT NULL
    AND
    "WorkflowRuntimeData"."assignedAt" >= ${fromDate}
    AND
    "WorkflowRuntimeData"."projectId" in (${projectIds?.join(',')})
) AS T
`;
