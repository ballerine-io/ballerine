import { z } from 'zod';
import { EndUserByIdSchema, EndUsersListSchema } from '../lib/zod/schemas/end-users';

export type TEndUser = z.infer<typeof EndUserByIdSchema.shape.endUser>;

export type TEndUsers = z.infer<typeof EndUsersListSchema.shape.endUsers>;
