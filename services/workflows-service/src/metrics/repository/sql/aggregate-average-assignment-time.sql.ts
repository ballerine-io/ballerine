export const aggregateAverageAssignmentTimeQuery = `
SELECT AVG(time)::varchar as average_time
FROM (
  SELECT
    "User".id,
    COALESCE(
      EXTRACT(EPOCH FROM ("WorkflowRuntimeData"."assignedAt" - "WorkflowRuntimeData"."createdAt")) * 1000,
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
    "WorkflowRuntimeData"."assignedAt" >= $1
) AS T
`;
