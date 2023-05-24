import { z } from 'zod';
import { FileInfoSchema } from './validation-schemas';

export type TFileInfo = z.infer<typeof FileInfoSchema>;
