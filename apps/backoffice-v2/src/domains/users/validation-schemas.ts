import { z } from 'zod';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';

export const UsersListSchema = z
  .array(
    ObjectWithIdSchema.extend({
      firstName: z.string(),
      lastName: z.string(),
      fullName: z.string().optional(),
      email: z.string(),
      phone: z.string().nullable(),
      avatarUrl: z.string().nullable().optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }).transform(({ firstName, lastName, ...rest }) => ({
      ...rest,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
    })),
  )
  .default([]);
