import { z } from 'zod';
import { EndUserByIdSchema, EndUsersListSchema } from '../lib/zod/schemas/end-users';
import { FileInfoSchema } from '../lib/zod/schemas/file-info';

export type TEndUser = z.infer<typeof EndUserByIdSchema>;

export type TEndUsers = z.infer<typeof EndUsersListSchema>;
export type TFileInfo = z.infer<typeof FileInfoSchema>;
