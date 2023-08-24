export const aggregateApprovalRateQuery = `
SELECT
  (CASE
    WHEN counts."resolvedCount" > 0 AND counts."approvedCount" > 0
    THEN (counts."approvedCount"::int / counts."resolvedCount"::int * 100)
    ELSE 0
  END)::numeric(5, 2)::varchar AS "approvalRate"
FROM (
  SELECT
    (SELECT COUNT(*)
     FROM "WorkflowRuntimeData"
     WHERE "resolvedAt" >= $1
       AND "projectId" in ($2)) AS "resolvedCount",
    (SELECT COUNT(*)
     FROM "WorkflowRuntimeData"
     WHERE context -> 'documents' @> '[{"decision": {"status": "approved"}}]'
       AND "resolvedAt" >= $1
       AND "projectId" in ($2)) AS "approvedCount"
) AS counts;
`;
