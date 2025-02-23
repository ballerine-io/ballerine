import { useContext } from 'react';
import { ValidatorContext } from '../../../context';

export const useValidator = () => {
  const context = useContext(ValidatorContext);

  if (!context) {
    throw new Error('Validator context is not provided.');
  }

  return context;
};
