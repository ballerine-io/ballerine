import { z } from 'zod';
import { AuthenticatedUserSchema } from './validation-schemas';

export type TAuthenticatedUser = z.output<typeof AuthenticatedUserSchema>;
