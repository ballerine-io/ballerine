export const selectActiveUsersQuery = `
select
id, "firstName", "lastName", "lastActiveAt"
from "User"
order by "lastActiveAt" desc nulls last`;
