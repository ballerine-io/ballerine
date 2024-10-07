import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, DropdownInput } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface IIndustriesFieldOptions {
  placeholder?: string;
}

export const IndustriesField: FunctionComponent<
  IFieldComponentProps<string, IIndustriesFieldOptions>
> = ({ fieldProps, definition, options, stack }) => {
  const { placeholder } = options;
  const { value, disabled, onChange, onBlur } = fieldProps;

  const { t } = useTranslation();

  const translatedIndustries = t('industries', { returnObjects: true }) as string[];

  const dropdownOptions = useMemo(
    () =>
      translatedIndustries.map(industry => ({
        label: industry,
        value: industry,
      })),
    [translatedIndustries],
  );

  return (
    <FieldLayout definition={definition} stack={stack}>
      <DropdownInput
        name={createTestId(definition, stack)}
        placeholdersParams={{ placeholder }}
        searchable
        options={dropdownOptions}
        value={value}
        testId={createTestId(definition, stack)}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
