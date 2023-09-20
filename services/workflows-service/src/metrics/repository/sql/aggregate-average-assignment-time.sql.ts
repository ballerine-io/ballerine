export const aggregateAverageAssignmentTimeQuery = `
SELECT AVG(time)::varchar as average_time
FROM (
  SELECT
    COALESCE(
      EXTRACT(EPOCH FROM ("WorkflowRuntimeData"."assignedAt" - "WorkflowRuntimeData"."createdAt")) * 1000,
      0
    ) AS time
  FROM
    "WorkflowRuntimeData"
  WHERE
    "WorkflowRuntimeData"."createdAt" IS NOT NULL
    AND
    "WorkflowRuntimeData"."assignedAt" >= $1
    AND
    "WorkflowRuntimeData"."projectId" in ($2)
) AS T
`;
