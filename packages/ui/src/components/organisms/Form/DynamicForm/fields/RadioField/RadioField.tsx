import { Label, RadioGroup } from '@/components/atoms';
import { RadioGroupItem } from '@/components/atoms/RadioGroup/RadioGroup.Item';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { ICommonFieldParams, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IRadioFieldOption {
  label: string;
  value: any;
}

export interface IRadioFieldParams extends ICommonFieldParams {
  options: IRadioFieldOption[];
}

export const RadioField: TDynamicFormField<IRadioFieldParams> = ({ element }) => {
  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus, disabled } = useField<any>(element, stack);
  const { options = [] } = element.params || {};

  return (
    <FieldLayout element={element}>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        data-testid={`${createTestId(element, stack)}-radio-group`}
      >
        {options.map(({ value, label }) => (
          <div
            className="flex items-center space-x-2"
            key={`radio-group-item-${value}`}
            data-testid={`${createTestId(element, stack)}-radio-group-item`}
          >
            <RadioGroupItem
              className="border-secondary bg-white text-black"
              value={value}
              id={`radio-group-item-${value}`}
            />
            <Label htmlFor={`radio-group-item-${value}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
