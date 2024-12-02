import { useImperativeHandle } from 'react';
import { useValidator } from '../../external/useValidator/useValidator';
import { IValidatorRef } from './types';

export const useValidatorRef = (refObject?: React.RefObject<IValidatorRef>): IValidatorRef => {
  const context = useValidator();

  useImperativeHandle(refObject, () => ({
    validate: context.validate,
  }));

  return context;
};
