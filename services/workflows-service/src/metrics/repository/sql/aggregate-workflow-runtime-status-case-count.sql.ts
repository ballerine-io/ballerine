export const aggregateWorkflowRuntimeStatusCaseCountQuery = `
select
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
    count("status") as status_count
  from
    "WorkflowRuntimeData"
  where "createdAt" >= coalesce($1, '1900-01-01'::timestamp)
  group by
    "status"
) as workflow_runtime_data`;
