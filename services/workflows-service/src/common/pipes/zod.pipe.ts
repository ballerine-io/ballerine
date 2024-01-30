import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import type { Paramtype } from '@nestjs/common/interfaces/features/paramtype.interface';
import { ZodValidationException } from '@/errors';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema, private readonly type: Paramtype) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (this.type !== metadata.type) {
      return value;
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new ZodValidationException(result.error);
    }

    return result.data;
  }
}
