import { z } from 'zod';
import { EndUserByIdSchema, EndUsersListSchema } from '../lib/zod/schemas/end-users';

export type TEndUser = z.infer<typeof EndUserByIdSchema>;

export type TEndUsers = z.infer<typeof EndUsersListSchema>;
