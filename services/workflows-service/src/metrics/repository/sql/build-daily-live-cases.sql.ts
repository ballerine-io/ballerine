import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildDailyLiveCasesQuery = (
  projectIds: TProjectIds,
  fromDate?: string,
  toDate?: string,
) => {
  // Use Prisma.join for safe parameterization of projectIds. Handles empty array.
  const projectIdsInClause =
    projectIds && projectIds.length > 0
      ? Prisma.sql`IN (${Prisma.join(projectIds)})`
      : Prisma.sql`IN (NULL)`; // `IN (NULL)` is effectively false

  // Safe WHERE condition for subqueries. Handles empty projectIds.
  const projectIdsSubqueryFilter =
    projectIds && projectIds.length > 0
      ? Prisma.sql`"projectId" IN (${Prisma.join(projectIds)})`
      : Prisma.sql`FALSE`; // Ensures subqueries return correctly (e.g., MIN returns NULL)

  // Determine the date range boundaries
  const fromDateSql = fromDate
    ? Prisma.sql`${fromDate}::timestamp`
    : Prisma.sql`(SELECT MIN("createdAt") FROM "WorkflowRuntimeData" WHERE ${projectIdsSubqueryFilter} AND parent_runtime_data_id IS NULL)`; // Default: earliest relevant record

  const toDateSql = toDate
    ? Prisma.sql`${toDate}::timestamp`
    : fromDate
    ? Prisma.sql`${fromDate}::timestamp`
    : Prisma.sql`CURRENT_DATE`; // Default: today

  return Prisma.sql`
    WITH RECURSIVE dates AS (
      SELECT date_trunc('day', COALESCE(${fromDateSql}, CURRENT_DATE)) as date
      UNION ALL
      SELECT (date + interval '1 day')::date -- Cast to date for comparison
      FROM dates
      WHERE date < date_trunc('day', COALESCE(${toDateSql}, CURRENT_DATE)) -- Use effective toDate
    ),
    case_dates AS (
      SELECT
        d.date,
        COUNT(DISTINCT w.id) as live_cases
      FROM dates d
      LEFT JOIN "WorkflowRuntimeData" w ON
        w."createdAt" <= d.date AND
        (w."resolvedAt" IS NULL OR w."resolvedAt" >= d.date) AND
        w."projectId" ${projectIdsInClause} AND
        w.parent_runtime_data_id IS NULL
      GROUP BY d.date
    )
    SELECT
      to_char(date, 'YYYY-MM-DD') as date,
      live_cases::integer as count
    FROM case_dates
    -- Remove 'AND live_cases > 0' to include days with zero count.
    WHERE date IS NOT NULL AND live_cases IS NOT NULL AND live_cases > 0
    ORDER BY date ASC;
  `;
};
