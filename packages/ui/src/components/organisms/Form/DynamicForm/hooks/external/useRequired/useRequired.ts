import { useMemo } from 'react';
import { IFormElement } from '../../../types';
import { checkIfRequired } from './helpers/check-if-required';

export const useRequired = (element: IFormElement, context: object) => {
  const isRequired = useMemo(() => checkIfRequired(element, context), [element, context]);

  return isRequired;
};
