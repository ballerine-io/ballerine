export const aggregateUserAverageReviewTimeQuery = `
select
  avg((extract(epoch from "resolvedAt") - extract(epoch from "assignedAt")) * 1000)::int as time
from "WorkflowRuntimeData"
  where "assigneeId" = $1
  and "resolvedAt" >= $2
group by "assigneeId"`;
