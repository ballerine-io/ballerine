import { createContext } from 'react';
import { IValidatorContext } from './types';

export const ValidatorContext = createContext<IValidatorContext<unknown>>({
  errors: [],
  values: {},
  isValid: true,
  validate: () => {
    throw new Error('Validator context is not provided.');
  },
});
