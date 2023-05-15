import { z } from 'zod';
import { State, States } from '../../../enums';
import { ObjectWithIdSchema } from '../utils/object-with-id';

export const UsersListSchema = z
  .array(
    ObjectWithIdSchema.extend({
      firstName: z.string(),
      lastName: z.string(),
      fullName: z.string().optional(),
      email: z.string(),
      phone: z.string().nullable(),
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
