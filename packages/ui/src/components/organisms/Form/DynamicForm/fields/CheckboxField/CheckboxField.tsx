import { Checkbox } from '@/components/atoms';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export const CheckboxField: TDynamicFormField = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { value, onChange, onFocus, onBlur, disabled } = useField<boolean | undefined>(
    element,
    stack,
  );

  return (
    <FieldLayout element={element} layout="horizontal">
      <Checkbox
        id={id}
        checked={Boolean(value)}
        onCheckedChange={onChange}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
