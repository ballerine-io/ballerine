import { isType } from '@ballerine/common';
import { z } from 'zod';

export const checkIsUnknownRecord = isType(z.record(z.string(), z.unknown()));
export const checkIsAnyRecord = isType(z.record(z.string(), z.any()));
