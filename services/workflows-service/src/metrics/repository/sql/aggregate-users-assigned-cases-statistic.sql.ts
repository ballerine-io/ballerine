export const aggregateUsersAssignedCasesStatisticQuery = `
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
  where "assignedAt" >= coalesce($1, '1900-01-01'::timestamp)
    AND "projectId" in ($2)
  group by "assigneeId"
) as agent_workflow_runtime on
agent_workflow_runtime."assigneeId" = "id"
order by "casesCount" desc
`;
