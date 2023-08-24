export const aggregateDailyCasesResolvedQuery = `
select
  date,
  sum((
    SELECT COUNT(*)
    FROM "WorkflowRuntimeData"
    WHERE "assigneeId" = coalesce($2, "WorkflowRuntimeData"."assigneeId")
      AND date_trunc('day', "resolvedAt"::timestamp) = date_trunc('day', date::timestamp)
      AND "projectId" in ($3)
  ))::int AS cases
from
generate_series($1::timestamp, now()::timestamp, interval '1 day') as date
group by date
order by date asc
`;
