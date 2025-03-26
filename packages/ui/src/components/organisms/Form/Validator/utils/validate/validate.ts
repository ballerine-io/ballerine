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
import { AbortAfterFirstErrorException } from './exceptions';
import { isShouldApplyValidation } from './helpers';
import { IValidateParams } from './types';

export const validate = <
  TValues extends object,
  TValidatorTypeExtends extends string = TBaseValidators,
>(
  context: TValues,
  schema: Array<IValidationSchema<TValidatorTypeExtends>>,
  params: IValidateParams = {},
  globalValidationRules: Array<ICommonValidator<TValues, TValidatorTypeExtends>> = [],
): IValidationError[] => {
  const { abortEarly = false, abortAfterFirstError = false } = params;

  const validationErrors: IValidationError[] = [];

  const run = (
    schema: Array<IValidationSchema<TValidatorTypeExtends>>,
    stack: TDeepthLevelStack = [],
  ) => {
    for (let i = 0; i < schema.length; i++) {
      const {
        validators: schemaValidators = [],
        children,
        valueDestination,
        id,
        metadata = {},
        getThisContext,
      } = schema[i]!;
      const formattedValueDestination = valueDestination
        ? formatValueDestination(valueDestination, stack)
        : '';

      const value = formattedValueDestination ? get(context, formattedValueDestination) : context;
      const validators = [...schemaValidators, ...globalValidationRules];

      try {
        for (const validator of validators) {
          if (
            validator.applyWhen &&
            !isShouldApplyValidation(
              replaceTagsWithIndexesInRule([validator.applyWhen], stack)[0],
              {
                ...context,
                ...(getThisContext?.(context, metadata, stack) || {}),
              },
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

            if (abortAfterFirstError) {
              throw new AbortAfterFirstErrorException();
            }

            // Validation of all schema will be stopped if at least one error is found
            if (abortEarly) {
              throw validationErrors;
            }
          }
        }
      } catch (exception) {
        if (exception instanceof AbortAfterFirstErrorException) {
          continue;
        }

        throw exception;
      }

      if (children?.length && Array.isArray(value)) {
        value.forEach((_, index) => {
          run(children as Array<IValidationSchema<TValidatorTypeExtends>>, [...stack, index]);
        });
      }
    }
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
