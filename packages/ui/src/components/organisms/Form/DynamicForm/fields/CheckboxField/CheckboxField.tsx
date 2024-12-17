import { Checkbox } from '@/components/atoms';
import { useField } from '../../hooks/external';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export const CheckboxField: TDynamicFormField = ({ element }) => {
  const { stack } = useStack();
  const { value, onChange, onFocus, onBlur, disabled } = useField<boolean | undefined>(
    element,
    stack,
  );

  return (
    <Checkbox
      checked={Boolean(value)}
      onChange={onChange}
      disabled={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
