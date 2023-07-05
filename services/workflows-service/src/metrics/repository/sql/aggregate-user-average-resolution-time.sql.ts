export const aggregateUserAverageResolutionTimeQuery = `
select
  "assigneeId" as id,
  avg((extract(epoch from "resolvedAt") - extract(epoch from "createdAt")) * 1000)::int as time
from "WorkflowRuntimeData"
  where "assigneeId" = $1
  and "resolvedAt" >= $2
group by "assigneeId"`;
