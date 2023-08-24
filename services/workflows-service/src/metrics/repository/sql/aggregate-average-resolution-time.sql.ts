export const aggregateAverageResolutionTimeQuery = `
SELECT AVG(time)::varchar as average_time
FROM (
  SELECT
    "User".id,
    COALESCE(
      EXTRACT(EPOCH FROM ("WorkflowRuntimeData"."resolvedAt" - "WorkflowRuntimeData"."createdAt")) * 1000,
      0
    ) AS time
  FROM
    "User"
  LEFT JOIN
    "WorkflowRuntimeData"
    ON "User".id = "WorkflowRuntimeData"."assigneeId"
  WHERE
    "WorkflowRuntimeData"."createdAt" IS NOT NULL
  AND
    "WorkflowRuntimeData"."resolvedAt" >= $1
  AND
    "WorkflowRuntimeData"."projectId" in ($2)
) AS T
	`;
