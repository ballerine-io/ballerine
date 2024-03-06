import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildAggregateUsersResolvedCasesStatisticQuery = (
  fromDate: Date = new Date(),
  projectIds: TProjectIds,
) => Prisma.sql`
select
  id,
  "firstName",
  "lastName",
  "casesCount"::int,
  email
from
  "User"
inner join (
  select
    "WorkflowRuntimeData"."assigneeId",
    count(*) as "casesCount"
  from
    "WorkflowRuntimeData"
  where "resolvedAt" >= ${fromDate}
  AND "projectId" in (${projectIds?.join(',')})
  group by "assigneeId"
) as agent_workflow_runtime on
agent_workflow_runtime."assigneeId" = "id"
order by "casesCount" desc
`;
