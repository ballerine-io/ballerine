import { useMemo } from 'react';
import { useStack } from '../../../fields';
import { IFormElement } from '../../../types';
import { checkIfRequired } from './helpers/check-if-required';

export const useRequired = (element: IFormElement, context: object) => {
  const { stack } = useStack();
  const isRequired = useMemo(
    () => checkIfRequired(element, context, stack),
    [element, context, stack],
  );

  return isRequired;
};
