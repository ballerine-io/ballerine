import { useMemo } from 'react';
import { IValidationSchema } from '../../../types';
import { validate } from '../../../utils/validate';

export interface IUseSyncValidateParams {
  abortEarly?: boolean;
  validateSync?: boolean;
  validateOnChange?: boolean;
}

export const useSyncValidate = (
  context: object,
  schema: IValidationSchema[],
  params: IUseSyncValidateParams = {},
) => {
  const { abortEarly = false, validateSync = false, validateOnChange = true } = params;

  return useMemo(() => {
    if (!validateSync || !validateOnChange) return [];

    return validate(context, schema, { abortEarly });
  }, [context, schema, abortEarly, validateSync, validateOnChange]);
};
