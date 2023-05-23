import { z } from 'zod';
import { FileInfoSchema } from '../lib/zod/schemas/file-info';

export type TFileInfo = z.infer<typeof FileInfoSchema>;
