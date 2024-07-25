import { createContext } from 'react';

type TIsValid = boolean;

export interface IValidatorContext {
  validateAll: () => Promise<TIsValid>;
}

export const validatorContext = createContext<IValidatorContext>({} as IValidatorContext);
