import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { Checkbox, createTestId } from '@ballerine/ui';
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
    <FieldLayout
      definition={definition}
      stack={stack}
      className="flex-row flex-row-reverse items-center justify-end"
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
    </FieldLayout>
  );
};
