export const aggregateUserApprovalRateQuery = `
select
	id,
	("resolvedWorkflowsCount"::numeric / "assignedWorkflowsCount"::numeric * 100)::int as "approvalRate"
from
	"User"
left join (
	select
		"assigneeId",
		count(*) as "assignedWorkflowsCount"
	from
		"WorkflowRuntimeData"
	group by
		"assigneeId") as assignedWorkflows on
	assignedWorkflows."assigneeId" = $1
left join (
	select
		"assigneeId",
		count(*) as "resolvedWorkflowsCount"
	from
		"WorkflowRuntimeData"
	where
		"resolvedAt" >= $2
		and "status" = 'completed'
	group by
		"assigneeId"
) as resolvedWorkflows on
	resolvedWorkflows."assigneeId" = $1
where
	"User".id = $1`;
