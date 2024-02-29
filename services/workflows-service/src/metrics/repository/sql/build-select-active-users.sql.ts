import { TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

export const buildSelectActiveUsersQuery = (projectIds: TProjectIds) => Prisma.sql`
select
id, "firstName", "lastName", "lastActiveAt"
from "User"
inner join "UserToProject" on "UserToProject"."userId" = "User".id
where "UserToProject"."projectId" in (${projectIds?.join(',')})
order by "lastActiveAt" desc nulls last`;
