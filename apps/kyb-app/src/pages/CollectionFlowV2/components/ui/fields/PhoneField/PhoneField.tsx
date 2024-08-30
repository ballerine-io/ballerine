import { FieldErrors } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldErrors';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, PhoneNumberInput } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export type TPhoneFieldValueType = string | undefined;

export interface IPhoneFieldOptions {
  defaultCountry?: string;
  enableSearch?: boolean;
}

const defaultOptions: IPhoneFieldOptions = {
  defaultCountry: 'us',
  enableSearch: true,
};

export const PhoneField: FunctionComponent<
  IFieldComponentProps<TPhoneFieldValueType, IPhoneFieldOptions>
> = ({ fieldProps, options = defaultOptions, stack, definition }) => {
  const {
    defaultCountry = defaultOptions.defaultCountry,
    enableSearch = defaultOptions.enableSearch,
  } = options;
  const { disabled, value, onBlur, onChange } = fieldProps;

  return (
    <FieldLayout definition={definition}>
      <PhoneNumberInput
        country={defaultCountry}
        enableSearch={enableSearch}
        disabled={disabled}
        value={value}
        testId={createTestId(definition, stack)}
        onChange={onChange}
        onBlur={onBlur}
      />
      <FieldErrors definition={definition} />
    </FieldLayout>
  );
};
