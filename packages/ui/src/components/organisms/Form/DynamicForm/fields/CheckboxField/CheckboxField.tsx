import { Checkbox, Label } from '@/components/atoms';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useRequired } from '../../hooks/external/useRequired';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { ICommonFieldParams, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export const CheckboxField: TDynamicFormField<ICommonFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { label } = element.params || {};
  const { stack } = useStack();
  const { id, hidden } = useElement(element, stack);
  const { value, onChange, onFocus, onBlur, disabled } = useField<boolean | undefined>(
    element,
    stack,
  );
  const { values } = useDynamicForm();
  const isRequired = useRequired(element, values);

  if (hidden) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-nowrap items-center gap-2">
        <Checkbox
          id={id}
          checked={Boolean(value)}
          onCheckedChange={onChange}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <Label id={`${id}-label`} htmlFor={`${id}`}>
          {`${isRequired ? `${label}` : `${label} (optional)`} `}
        </Label>
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </div>
  );
};
