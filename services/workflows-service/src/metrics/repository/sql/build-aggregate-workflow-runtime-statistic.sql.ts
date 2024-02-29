import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildAggregateWorkflowRuntimeStatisticQuery = (projectIds: TProjectIds) => Prisma.sql`
select
  "workflowDefinitionId",
  "name" as "workflowDefinitionName",
sum(
  case
    when workflow_runtime_data."status" = 'active' then workflow_runtime_data.status_count
    else 0
  end
)::int as active,
sum(
  case
    when workflow_runtime_data."status" = 'completed' then workflow_runtime_data.status_count
    else 0
  end
)::int as completed,
sum(
  case
    when workflow_runtime_data."status" = 'failed' then workflow_runtime_data.status_count
    else 0
  end
)::int as failed
from
(
  select
    "status",
    "workflowDefinitionId",
    count("status") as status_count
  from
    "WorkflowRuntimeData"
  where
    "projectId" in (${projectIds?.join(',')})
  group by
    "workflowDefinitionId",
    "status"
) as workflow_runtime_data
inner join (select * from "WorkflowDefinition") as workflowDefinition on workflowDefinition."id" = "workflowDefinitionId"
group by "workflowDefinitionId","workflowDefinitionName"`;
