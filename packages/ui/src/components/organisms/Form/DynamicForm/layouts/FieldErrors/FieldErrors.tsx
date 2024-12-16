import { ErrorsList } from '@/components/molecules/ErrorsList';
import { FunctionComponent, useMemo } from 'react';
import { useValidator } from '../../../Validator';
import { useElement } from '../../hooks/external';
import { IFormElement } from '../../types';

export interface IFieldErrorsProps {
  element: IFormElement;
  stack?: number[];
}

export const FieldErrors: FunctionComponent<IFieldErrorsProps> = ({ element, stack }) => {
  const { id } = useElement(element, stack);
  const { errors: _validationErrors } = useValidator();

  const fieldErrors = useMemo(() => {
    return _validationErrors
      .filter(error => error.id === id)
      .map(error => error.message)
      .flat();
  }, [_validationErrors, id]);

  return <ErrorsList errors={fieldErrors || []} />;
};
