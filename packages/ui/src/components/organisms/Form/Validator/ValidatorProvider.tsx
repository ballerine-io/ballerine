import { ValidatorContext } from './context';
import { IValidatorRef, useValidatorRef } from './hooks/internal/useValidatorRef';
import { IValidationSchema } from './types';

export interface IValidatorProviderProps<TValue> {
  children: React.ReactNode | React.ReactNode[];
  schema: IValidationSchema[];
  value: TValue;

  ref?: React.RefObject<IValidatorRef>;
  validateOnChange?: boolean;
}

export const ValidatorProvider = <TValue,>({
  children,
  schema,
  value,
  ref,
}: IValidatorProviderProps<TValue>) => {
  useValidatorRef(ref);

  return <ValidatorContext.Provider value={{}}>{children}</ValidatorContext.Provider>;
};
