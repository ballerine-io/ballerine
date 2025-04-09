import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildDailyLiveCasesQuery = (
  projectIds: TProjectIds,
  fromDate?: string,
  toDate?: string,
) => Prisma.sql`
WITH RECURSIVE dates AS (
  SELECT date_trunc('day', ${fromDate}::timestamp) as date
  UNION ALL
  SELECT date + interval '1 day'
  FROM dates
  WHERE date < date_trunc('day', ${toDate}::timestamp)
),
case_dates AS (
  SELECT
    d.date,
    COUNT(DISTINCT w.id) as live_cases
  FROM dates d
  LEFT JOIN "WorkflowRuntimeData" w ON
    w."createdAt" <= d.date AND
    (w."resolvedAt" IS NULL OR w."resolvedAt" >= d.date) AND
    w."projectId" IN (${projectIds?.join(',')})
  GROUP BY d.date
)
SELECT
  to_char(date, 'YYYY-MM-DD') as date,
  live_cases as count
FROM case_dates
WHERE date IS NOT NULL AND live_cases IS NOT NULL AND live_cases > 0
ORDER BY date ASC;
`;
