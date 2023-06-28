import { z } from 'zod';
import { IndividualByIdSchema } from './validation-schemas';

// @TODO: Remove
export type TIndividual = z.infer<typeof IndividualByIdSchema>;
