import { z } from 'zod';
import { BusinessFilterSchema } from '@/filter/dtos/temp-zod-schemas';

export type TBusinessFilter = z.output<typeof BusinessFilterSchema>;
