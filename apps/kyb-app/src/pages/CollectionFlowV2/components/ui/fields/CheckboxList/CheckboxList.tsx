import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { Checkbox, createTestId, ctw } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface ICheckboxListOption {
  label: string;
  value: string;
}

export interface ICheckboxListFieldOptions {
  options: ICheckboxListOption[];
}

export const CheckboxListField: FunctionComponent<
  IFieldComponentProps<string[], ICheckboxListFieldOptions>
> = ({ fieldProps, definition, options: _options, stack }) => {
  const { value = [], onChange, disabled } = fieldProps;
  const { options = [] } = _options || {};

  return (
    <FieldLayout definition={definition} stack={stack}>
      <div
        className={ctw('flex flex-col gap-4', { 'pointer-events-none opacity-50': disabled })}
        data-testid={createTestId(definition, stack)}
      >
        {options.map(option => (
          <label className="flex items-center gap-2" key={option.value}>
            <Checkbox
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-white"
              color="primary"
              value={option.value}
              checked={Array.isArray(value) && value.includes(option.value)}
              data-testid={`${createTestId(definition, stack)}-checkbox`}
              onCheckedChange={_ => {
                let val = (value as string[]) || [];

                if (val.includes(option.value)) {
                  val = val.filter(val => val !== option.value);
                } else {
                  val.push(option.value);
                }

                onChange(val);
              }}
            />
            <span className="font-inter text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </FieldLayout>
  );
};
