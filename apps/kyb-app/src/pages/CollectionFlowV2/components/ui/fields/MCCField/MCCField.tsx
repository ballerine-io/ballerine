import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { mccOptions } from '@/pages/CollectionFlowV2/components/ui/fields/MCCField/options';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, DropdownInput } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface IMCCFieldOptions {
  placeholder?: string;
}

export const MCCField: FunctionComponent<IFieldComponentProps<string, IMCCFieldOptions>> = ({
  fieldProps,
  definition,
  options,
  stack,
}) => {
  const { placeholder } = options;
  const { value, disabled, onChange, onBlur } = fieldProps;

  return (
    <FieldLayout definition={definition} stack={stack}>
      <DropdownInput
        name={createTestId(definition, stack)}
        placeholdersParams={{ placeholder }}
        searchable
        options={mccOptions}
        value={value}
        testId={createTestId(definition, stack)}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
