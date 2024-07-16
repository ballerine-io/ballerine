import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildAggregateWorkflowDefinitionVariantsMetric = (
  projectIds: TProjectIds,
) => Prisma.sql`
SELECT
  variant,
  COUNT(*) AS count
FROM
  "WorkflowDefinition"
WHERE
  "projectId" IN (${projectIds?.join(',')})
  OR "isPublic" = true
GROUP BY
  variant;
`;
