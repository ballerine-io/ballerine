import { useMemo } from 'react';
import { IValidatorContext, ValidatorContext } from './context';
import { checkIfValid } from './helpers';
import { useValidate } from './hooks/internal/useValidate';
import { IValidatorRef, useValidatorRef } from './hooks/internal/useValidatorRef';
import { IValidationSchema } from './types';

export interface IValidationParams {
  validateOnChange?: boolean;
  validateSync?: boolean;
  validationDelay?: number;
  abortEarly?: boolean;
}

export interface IValidatorProviderProps<TValue extends object> extends IValidationParams {
  children: React.ReactNode | React.ReactNode[];
  schema: IValidationSchema[];
  value: TValue;

  ref?: React.RefObject<IValidatorRef>;
}

export const ValidatorProvider = <TValue extends object>({
  children,
  schema,
  value,
  validateOnChange,
  validateSync,
  abortEarly,
  validationDelay,
  ref,
}: IValidatorProviderProps<TValue>) => {
  useValidatorRef(ref);
  const { errors, validate } = useValidate(value, schema, {
    abortEarly,
    validateSync,
    validateOnChange,
    validationDelay,
  });

  console.log('Validation errors', errors, schema);

  const context: IValidatorContext<TValue> = useMemo(
    () => ({ errors, values: value, isValid: checkIfValid(errors), validate }),
    [errors, value, validate],
  );

  return <ValidatorContext.Provider value={context}>{children}</ValidatorContext.Provider>;
};
