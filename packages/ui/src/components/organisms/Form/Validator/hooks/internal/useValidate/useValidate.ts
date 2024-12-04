import { useMemo } from 'react';
import { IValidationSchema } from '../../../types';
import { useAsyncValidate } from './useAsyncValidate';
import { useManualValidate } from './useManualValidate';
import { useSyncValidate } from './useSyncValidate';

export interface IUseValidateParams {
  validateOnChange?: boolean;
  validateSync?: boolean;
  validationDelay?: number;
  abortEarly?: boolean;
}

export const useValidate = (
  context: object,
  schema: IValidationSchema[],
  params: IUseValidateParams = {},
) => {
  const {
    validateOnChange = true,
    validateSync = false,
    validationDelay = 500,
    abortEarly = false,
  } = params;

  const [manualValidationErrors, manualValidate] = useManualValidate(context, schema, {
    abortEarly,
  });
  const syncValidationErrors = useSyncValidate(context, schema, {
    abortEarly,
    validateOnChange,
    validateSync,
  });
  const asyncValidationErrors = useAsyncValidate(context, schema, {
    abortEarly,
    validateOnChange,
    validateAsync: !validateSync,
    validationDelay,
  });

  const validationErrors = useMemo(() => {
    if (!validateOnChange) return manualValidationErrors;

    if (validateSync) return syncValidationErrors;

    return asyncValidationErrors;
  }, [
    manualValidationErrors,
    syncValidationErrors,
    asyncValidationErrors,
    validateOnChange,
    validateSync,
  ]);

  return {
    errors: validationErrors,
    validate: manualValidate,
  };
};
