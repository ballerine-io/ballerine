export const aggregateAverageReviewTimeQuery = `
SELECT AVG(time)::varchar as average_time
FROM (
  SELECT
    "User".id,
    COALESCE(
      EXTRACT(EPOCH FROM ("WorkflowRuntimeData"."resolvedAt" - "WorkflowRuntimeData"."assignedAt")) * 1000,
      0
    ) AS time
  FROM
    "User"
  LEFT JOIN
    "WorkflowRuntimeData"
    ON "User".id = "WorkflowRuntimeData"."assigneeId"
  WHERE
    "WorkflowRuntimeData"."assignedAt" IS NOT NULL
    AND
    "WorkflowRuntimeData"."resolvedAt" >= $1
) AS T
`;
