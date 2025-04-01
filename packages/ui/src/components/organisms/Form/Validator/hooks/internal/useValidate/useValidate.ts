import debounce from 'lodash/debounce';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ICommonValidator, IValidationError, IValidationSchema } from '../../../types';
import { validate } from '../../../utils/validate';

export interface IUseValidateParams {
  validateOnChange?: boolean;
  validationDelay?: number;
  abortEarly?: boolean;
  abortAfterFirstError?: boolean;
  globalValidationRules?: Array<ICommonValidator<object, string>>;
}

export const useValidate = (
  context: object,
  schema: IValidationSchema[],
  params: IUseValidateParams = {},
) => {
  const {
    validateOnChange = true,
    validationDelay = undefined,
    abortEarly = false,
    abortAfterFirstError = false,
    globalValidationRules,
  } = params;

  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(() => {
    if (validateOnChange && validationDelay === undefined) {
      return validate(context, schema, { abortEarly, abortAfterFirstError }, globalValidationRules);
    }

    return [];
  });

  const debouncedValidate = useCallback(
    debounce((context, schema) => {
      const errors = validate(
        context,
        schema,
        { abortEarly, abortAfterFirstError },
        globalValidationRules,
      );
      setValidationErrors(errors);
    }, validationDelay),
    [validationDelay],
  );

  const validateSyncCallback = useCallback(
    (context: object, schema: IValidationSchema[]) => {
      const errors = validate(
        context,
        schema,
        { abortEarly, abortAfterFirstError },
        globalValidationRules,
      );
      setValidationErrors(errors);
    },
    [abortEarly, abortAfterFirstError, globalValidationRules],
  );

  const externalValidate = useCallback((): Promise<IValidationError[]> => {
    return new Promise(resolve => {
      const errors = validate(
        context,
        schema,
        { abortEarly, abortAfterFirstError },
        globalValidationRules,
      );
      setValidationErrors(() => {
        setTimeout(() => {
          resolve(errors);
        }, 10);

        return errors;
      });
    });
  }, [abortEarly, abortAfterFirstError, context, schema, globalValidationRules]);

  useLayoutEffect(() => {
    if (validateOnChange && validationDelay === undefined) {
      validateSyncCallback(context, schema);
    }
  }, [validateOnChange, validateSyncCallback, context, schema, validationDelay]);

  useEffect(() => {
    if (validateOnChange && validationDelay === undefined) {
      return;
    }

    if (validateOnChange) {
      debouncedValidate(context, schema);
    }
  }, [validateOnChange, context, schema, debouncedValidate, validationDelay]);

  return {
    errors: validationErrors,
    validate: externalValidate,
  };
};
