import { useMemo } from 'react';
import { IValidatorContext, ValidatorContext } from './context';
import { checkIfValid } from './helpers';
import { useValidate } from './hooks/internal/useValidate';
import { IValidatorRef, useValidatorRef } from './hooks/internal/useValidatorRef';
import { IValidationSchema } from './types';
import { IValidateParams } from './utils/validate/types';

export interface IValidationParams extends IValidateParams {
  validateOnChange?: boolean;
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
  abortEarly,
  validationDelay,
  abortAfterFirstError,
  ref,
}: IValidatorProviderProps<TValue>) => {
  useValidatorRef(ref);
  const { errors, validate } = useValidate(value, schema, {
    abortEarly,
    validateOnChange,
    validationDelay,
    abortAfterFirstError,
  });

  const context: IValidatorContext<TValue> = useMemo(
    () => ({ errors, values: value, isValid: checkIfValid(errors), validate }),
    [errors, value, validate],
  );

  return <ValidatorContext.Provider value={context}>{children}</ValidatorContext.Provider>;
};
