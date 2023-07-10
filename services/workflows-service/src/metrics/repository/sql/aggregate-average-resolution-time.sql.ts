export const aggregateAverageResolutionTimeQuery = `
select
	avg(
	(select sum(case
		when "createdAt" notnull and "resolvedAt" notnull
		then (extract(epoch from "resolvedAt") - extract(epoch from "createdAt")) * 1000
		else 0
		end)::int as time
	from "WorkflowRuntimeData"
	where "assigneeId" = "User".id
	and "resolvedAt" >= $1)
	)::int as time
from
	"User"
where
	"User".id = coalesce($2,
	"id")`;
