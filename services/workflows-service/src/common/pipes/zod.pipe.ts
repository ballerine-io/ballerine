import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.Schema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }

    return result.data;
  }
}
