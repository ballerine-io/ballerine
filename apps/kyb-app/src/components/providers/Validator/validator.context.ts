import { createContext } from 'react';

type TIsValid = boolean;
type TFielName = string;

export type TValidationErrors = Record<TFielName, string>;
export interface IValidatorContext {
  validate: () => TIsValid;
  errors: TValidationErrors;
}

export const validatorContext = createContext<IValidatorContext>({} as IValidatorContext);
