import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildAggregateDailyCasesResolvedQuery = (
  fromDate: Date = new Date(),
  userId: string,
  projectIds: TProjectIds,
) => Prisma.sql`
select
  date,
  sum((
    SELECT COUNT(*)
    FROM "WorkflowRuntimeData"
    WHERE "assigneeId" = coalesce(${userId}, "WorkflowRuntimeData"."assigneeId")
      AND date_trunc('day', "resolvedAt"::timestamp) = date_trunc('day', date::timestamp)
      AND "projectId" in (${projectIds?.join(',')})
  ))::int AS cases
from
generate_series(${fromDate}::timestamp, now()::timestamp, interval '1 day') as date
group by date
order by date asc
`;
