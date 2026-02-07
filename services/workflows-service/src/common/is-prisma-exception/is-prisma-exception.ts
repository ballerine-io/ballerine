import { isType } from '@ballerine/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const isPrismaException = (value: unknown): value is PrismaClientKnownRequestError =>
  isType(z.object({ code: z.string() }))(value);
