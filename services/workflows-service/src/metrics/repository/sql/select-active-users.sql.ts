export const selectActiveUsersQuery = `
select
id, "firstName", "lastName", "lastActiveAt"
from "User"
inner join "UserToProject" on "UserToProject"."userId" = "User".id
where "UserToProject"."projectId" in ($1)
order by "lastActiveAt" desc nulls last`;
