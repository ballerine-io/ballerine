import get from 'lodash/get';
import { replaceTagsWithIndexesInRule } from '../../../DynamicForm';
import {
  ICommonValidator,
  IValidationError,
  IValidationSchema,
  TBaseValidators,
  TDeepthLevelStack,
} from '../../types';
import { createValidationError } from '../create-validation-error';
import { formatValueDestination } from '../format-value-destination';
import { getValidator } from '../get-validator';
import { isShouldApplyValidation } from './helpers';
import { IValidateParams } from './types';

export const validate = <
  TValues extends object,
  TValidatorTypeExtends extends string = TBaseValidators,
>(
  context: TValues,
  schema: Array<IValidationSchema<TValidatorTypeExtends>>,
  params: IValidateParams = {},
): IValidationError[] => {
  const { abortEarly = false } = params;

  const validationErrors: IValidationError[] = [];

  const run = (
    schema: Array<IValidationSchema<TValidatorTypeExtends>>,
    stack: TDeepthLevelStack = [],
  ) => {
    schema.forEach(schema => {
      const { validators = [], children, valueDestination, id } = schema;
      const formattedValueDestination = valueDestination
        ? formatValueDestination(valueDestination, stack)
        : '';

      const value = formattedValueDestination ? get(context, formattedValueDestination) : context;

      for (const validator of validators) {
        if (
          validator.applyWhen &&
          !isShouldApplyValidation(
            replaceTagsWithIndexesInRule([validator.applyWhen], stack)[0],
            context,
          )
        ) {
          continue;
        }

        const validate = getValidator(validator);

        try {
          validate(value, validator as unknown as ICommonValidator);
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
          run(children as Array<IValidationSchema<TValidatorTypeExtends>>, [...stack, index]);
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
