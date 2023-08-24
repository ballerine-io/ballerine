export const selectActiveUsersQuery = `
select
id, "firstName", "lastName", "lastActiveAt"
from "User"
joins "UserProject" on "UserProject"."userId" = "User".id
where "UserProject"."projectId" in ($1)
order by "lastActiveAt" desc nulls last`;
