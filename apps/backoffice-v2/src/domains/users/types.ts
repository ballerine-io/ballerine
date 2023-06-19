import { z } from 'zod';
import { UsersListSchema } from './validation-schemas';

export type TUsers = z.infer<typeof UsersListSchema>;
