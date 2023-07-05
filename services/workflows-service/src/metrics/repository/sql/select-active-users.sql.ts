export const selectActiveUsersQuery = `
select
id, "firstName", "lastName", "lastActiveAt"
from "User"
  where "User"."lastActiveAt"  >= $1
order by "lastActiveAt" desc`;
