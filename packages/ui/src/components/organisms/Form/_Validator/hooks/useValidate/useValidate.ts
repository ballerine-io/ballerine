import { UIElementV2 } from '@/components/providers/Validator/types';
import { useCallback } from 'react';
import { validate as _validate } from './validate';

interface IUseValidateParams {
  elements: UIElementV2[];
  context: unknown;
}

export interface IValidationError {
  id: string;
  message: string;
  element: UIElementV2;
  valueDestination: string;
  stack: number[];
}

export const useValidate = ({ elements, context }: IUseValidateParams) => {
  const validate = useCallback(() => {
    return _validate(elements, context as object);
  }, [elements, context]);

  return validate;
};
