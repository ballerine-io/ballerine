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
  ("projectId" IS NOT NULL AND "projectId" IN (${Prisma.join(projectIds!)}))
  OR ("isPublic" = true AND "projectId" IS NULL)
GROUP BY
  variant;
`;
