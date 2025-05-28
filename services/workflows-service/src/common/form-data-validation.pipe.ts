import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FormDataValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const transformedValue = Object.keys(value).reduce((acc: Record<string, any>, key) => {
      // Skip file properties
      if (key === 'file') {
        return acc;
      }

      const val = value[key];
      if (typeof val === 'string') {
        try {
          acc[key] = JSON.parse(val) as any;
        } catch {
          acc[key] = val as any;
        }
      } else {
        acc[key] = val as any;
      }
      return acc;
    }, {} as Record<string, any>);

    const object = plainToClass(metatype, transformedValue);
    const errors = await validate(object);

    if (errors?.length) {
      const errorMessages = errors
        .map(error => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new BadRequestException(errorMessages);
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
