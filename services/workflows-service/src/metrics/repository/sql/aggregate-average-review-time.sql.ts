export const aggregateAverageReviewTimeQuery = `
SELECT AVG(time)::varchar as average_time
FROM (
  SELECT
    COALESCE(
      EXTRACT(EPOCH FROM ("WorkflowRuntimeData"."resolvedAt" - "WorkflowRuntimeData"."assignedAt")) * 1000,
      0
    ) AS time
  FROM
    "WorkflowRuntimeData"
  WHERE
    "WorkflowRuntimeData"."assignedAt" IS NOT NULL
    AND
    "WorkflowRuntimeData"."resolvedAt" >= $1
    AND
    "WorkflowRuntimeData"."projectId" in ($2)
) AS T
`;
