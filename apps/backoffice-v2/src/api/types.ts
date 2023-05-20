import { z } from 'zod';
import { FileInfoSchema } from '../lib/zod/schemas/file-info';
import { AuthenticatedUserSchema } from '../lib/zod/schemas/authenticated-user';
import { UsersListSchema } from '../lib/zod/schemas/users';

export type TUsers = z.infer<typeof UsersListSchema>;
export type TAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
export type TFileInfo = z.infer<typeof FileInfoSchema>;
