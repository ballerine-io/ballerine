import { z } from 'zod';
import { EndUserFilterSchema } from '@/filter/dtos/temp-zod-schemas';

export type TEndUserFilter = z.output<typeof EndUserFilterSchema>;
