import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { Checkbox, createTestId, ctw } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface ICheckboxFieldOptions {
  label: string;
}

export const CheckboxField: FunctionComponent<
  IFieldComponentProps<boolean, ICheckboxFieldOptions>
> = ({ fieldProps, definition, options, stack }) => {
  const { value, onChange, onBlur, disabled } = fieldProps;
  const { label } = options;

  return (
    <label
      className={ctw('flex flex-row items-center gap-3', {
        'pointer-events-none opacity-50': disabled,
      })}
    >
      <Checkbox
        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-white"
        color="primary"
        checked={value}
        disabled={disabled}
        data-testid={createTestId(definition, stack)}
        onCheckedChange={e => {
          onChange(Boolean(e));
        }}
        onBlur={onBlur}
      />
      <span className="select-none">{label}</span>
    </label>
  );
};
