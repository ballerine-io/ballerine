import { IValidationSchema } from '../../../types';

import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { IValidationError } from '../../../types';
import { validate } from '../../../utils/validate';

export interface IUseAsyncValidateParams {
  validationDelay?: number;
  validateAsync?: boolean;
  validateOnChange?: boolean;
  abortEarly?: boolean;
}

export const useAsyncValidate = (
  context: object,
  schema: IValidationSchema[],
  params: IUseAsyncValidateParams = {},
) => {
  const {
    validationDelay = 500,
    validateAsync = false,
    validateOnChange = true,
    abortEarly = false,
  } = params;

  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(() =>
    validateAsync ? validate(context, schema, { abortEarly }) : [],
  );

  const validateWithDebounce = useCallback(
    debounce((context: object, schema: IValidationSchema[], params: IUseAsyncValidateParams) => {
      const errors = validate(context, schema, params);
      setValidationErrors(errors);
    }, validationDelay),
    [validationDelay],
  );

  useEffect(() => {
    if (!validateAsync || !validateOnChange) return;

    validateWithDebounce(context, schema, { abortEarly });
  }, [context, schema, validateAsync, validateOnChange, abortEarly, validateWithDebounce]);

  return validationErrors;
};
