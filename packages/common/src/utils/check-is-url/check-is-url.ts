import { isType } from '@/utils';
import { z } from 'zod';

export const checkIsUrl = isType(z.string().url());
