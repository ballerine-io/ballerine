import { z } from 'zod';
import { AuthenticatedUserSchema } from './validation-schemas';

export type TAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
