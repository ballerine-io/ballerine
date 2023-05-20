import { z } from 'zod';
import { IndividualByIdSchema, IndividualsListSchema } from './validation-schemas';

export type TIndividual = z.infer<typeof IndividualByIdSchema>;
export type TIndividuals = z.infer<typeof IndividualsListSchema>;
