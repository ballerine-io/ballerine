import get from 'lodash/get';
import { IValidationError, IValidationSchema } from '../../types';
import { createValidationError } from '../create-validation-error';
import { formatValueDestination } from '../format-value-destination';
import { getValidator } from '../get-validator';
import { IValidateParams } from './types';

// TODO: Codnitional Apply
// TODO: Test coverage ror custom validators

export const validate = <TValues extends object>(
  context: TValues,
  schema: IValidationSchema[],
  params: IValidateParams = {},
): IValidationError[] => {
  const { abortEarly = false } = params;

  const validationErrors: IValidationError[] = [];

  const run = (schema: IValidationSchema[], stack: number[] = []) => {
    schema.forEach(schema => {
      const { validators = [], children, valueDestination, id } = schema;
      const formattedValueDestination = valueDestination
        ? formatValueDestination(valueDestination, stack)
        : '';

      const value = formattedValueDestination ? get(context, formattedValueDestination) : context;

      for (const validator of validators) {
        const validate = getValidator(validator);

        try {
          validate(value, validator);
        } catch (exception) {
          const error = createValidationError({
            id,
            invalidValue: value,
            message: (exception as Error).message,
            stack,
          });

          validationErrors.push(error);

          if (abortEarly) {
            throw validationErrors;
          }
        }
      }

      if (children?.length && Array.isArray(value)) {
        value.forEach((_, index) => {
          run(children, [...stack, index]);
        });
      }
    });
  };

  try {
    run(schema);
  } catch (exception) {
    if (exception instanceof Error) {
      throw exception;
    }

    return validationErrors;
  }

  return validationErrors;
};
