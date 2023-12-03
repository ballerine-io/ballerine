import { z } from 'zod';

export const AuthenticatedUserSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().nullable().optional(),
  })
  .transform(({ firstName, lastName, ...other }) => ({
    ...other,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  }))
  .or(z.null())
  .default(null);
