import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsUrl = isType(z.string().url());
