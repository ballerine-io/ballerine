import { ctw } from '@/common';
import { Checkbox } from '@/components/atoms';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface ICheckboxListOption {
  label: string;
  value: string;
}

export interface ICheckboxListFieldParams {
  options: ICheckboxListOption[];
}

export const CheckboxListField: TDynamicFormField<ICheckboxListFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { options = [] } = element.params || {};
  const { stack } = useStack();
  const { value, onChange, onFocus, onBlur, disabled } = useField<string[]>(element, stack);

  return (
    <FieldLayout element={element}>
      <div
        className={ctw('flex flex-col gap-4', { 'pointer-events-none opacity-50': disabled })}
        data-testid={createTestId(element, stack)}
      >
        {options.map((option, index) => (
          <label className="flex items-center gap-2" key={option.value}>
            <Checkbox
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-white"
              color="primary"
              value={option.value}
              checked={Array.isArray(value) && value.includes(option.value)}
              data-testid={`${createTestId(element, stack)}-checkbox-${index}`}
              onFocus={onFocus}
              onBlur={onBlur}
              onCheckedChange={_ => {
                let val = (value as string[]) || [];

                if (val.includes(option.value)) {
                  val = val.filter(val => val !== option.value);
                } else {
                  val.push(option.value);
                }

                onChange(val.length ? val : undefined);
              }}
            />
            <span className="font-inter text-sm">{option.label}</span>
          </label>
        ))}
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
