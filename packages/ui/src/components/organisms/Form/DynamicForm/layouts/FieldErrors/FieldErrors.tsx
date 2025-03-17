import { ErrorsList } from '@/components/molecules/ErrorsList';
import { FunctionComponent, useMemo } from 'react';
import { useValidator } from '../../../Validator';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { useElement, useField } from '../../hooks/external';
import { IFormElement } from '../../types';

export interface IFieldErrorsProps {
  element: IFormElement;
}

export const FieldErrors: FunctionComponent<IFieldErrorsProps> = ({ element }) => {
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { touched } = useField(element, stack);
  const { errors: _validationErrors } = useValidator();

  const fieldErrors = useMemo(() => {
    if (!touched) return [];

    return _validationErrors
      .filter(error => error.id === id)
      .map(error => error.message)
      .flat();
  }, [_validationErrors, id, touched]);

  return <ErrorsList errors={fieldErrors || []} className="mt-2" />;
};
