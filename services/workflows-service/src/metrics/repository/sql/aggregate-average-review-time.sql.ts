export const aggregateAverageReviewTimeQuery = `
select
	avg(
	(select sum(case
		when "resolvedAt" notnull and "assignedAt" notnull
		then (extract(epoch from "resolvedAt") - extract(epoch from "assignedAt")) * 1000
		else 0
		end)::bigint  as time
	from "WorkflowRuntimeData"
	where "assigneeId" = "User".id
	and "resolvedAt" >= $1)
	)::varchar as time
from
	"User"
where
	"User".id = coalesce($2,
	"id")`;
