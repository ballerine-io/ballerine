import { registerDecorator, ValidationOptions } from 'class-validator';

export const oneOf =
  (list: Array<string | number>, options?: ValidationOptions) =>
  (obj: object, paramName: string) => {
    registerDecorator({
      name: 'oneOf',
      target: obj.constructor,
      propertyName: paramName,
      constraints: list,
      options: {
        message: `Value must be one of ${JSON.stringify(list)}`,
        ...options,
      },
      validator: {
        validate: (value: string | number) => list.some(val => val === value),
      },
    });
  };
