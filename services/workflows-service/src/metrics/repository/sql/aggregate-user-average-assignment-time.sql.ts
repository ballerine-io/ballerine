export const aggregateUserAverageAssignmentTimeQuery = `
select
    "assigneeId" as id,
    avg((extract(epoch from "assignedAt") - extract(epoch from "createdAt")) * 1000)::int as time
from "WorkflowRuntimeData"
  where "assigneeId" = $1
  and "assignedAt" >= $2
group by "assigneeId"
`;
