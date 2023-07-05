export const aggregateUserDailyCasesResolvedQuery = `
select
  date,
  sum((
    SELECT COUNT(*)
    FROM "WorkflowRuntimeData"
    WHERE "assigneeId" = $1
      AND date_trunc('day', "resolvedAt"::timestamp) = date_trunc('day', date::timestamp)
  ))::int AS cases
from
generate_series($2::timestamp, $3::timestamp, interval '1 day') as date
group by date
order by date asc
`;
