export const aggregateApprovalRateQuery = `
select
	(case
		when "resolvedCount" > 0 and "approvedCount" > 0
		then ("approvedCount"::numeric / "resolvedCount"::numeric * 100)
		else 0 end
		)::int as "approvalRate"
from
	(
	select
		(
		select
			count(*)
		from
			"WorkflowRuntimeData"
		where "resolvedAt" >= $1
		and "assigneeId" = coalesce($2, "assigneeId")
		) as "resolvedCount",
		(
		select count(*)
		from "WorkflowRuntimeData"
		where "resolvedAt" >= $1
		and "assigneeId" = coalesce($2, "assigneeId")
		and "status" = 'completed'
		) as "approvedCount"

	from
		"WorkflowRuntimeData"
	group by "resolvedCount", "approvedCount"

) as counts
`;
