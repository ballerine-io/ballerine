import { useCallback, useState } from 'react';
import { IValidationError, IValidationSchema } from '../../../types';
import { validate } from '../../../utils/validate';

export interface IUseManualValidateParams {
  abortEarly?: boolean;
}

export const useManualValidate = (
  context: object,
  schema: IValidationSchema[],
  params: IUseManualValidateParams = {},
): [IValidationError[], () => void] => {
  const [validationErrors, setValidationErrors] = useState<IValidationError[]>([]);

  const { abortEarly = false } = params;

  const _validate = useCallback(() => {
    const errors = validate(context, schema, { abortEarly });
    setValidationErrors(errors);
  }, [context, schema, abortEarly]);

  return [validationErrors, _validate];
};
