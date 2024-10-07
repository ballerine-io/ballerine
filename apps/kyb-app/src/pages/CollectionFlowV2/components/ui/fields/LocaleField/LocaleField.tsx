import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, DropdownInput } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface ILocaleFieldOptions {
  placeholder?: string;
}

export const LocaleField: FunctionComponent<IFieldComponentProps<string, ILocaleFieldOptions>> = ({
  fieldProps,
  definition,
  options,
  stack,
}) => {
  const { value, disabled, onChange, onBlur } = fieldProps;
  const { placeholder = '' } = options || {};

  const { t } = useTranslation();

  const dropdownOptions = useMemo(
    () =>
      (
        t('languages', { returnObjects: true }) as Array<{
          const: string;
          title: string;
        }>
      ).map(({ const: constValue, title }) => ({
        label: title,
        value: constValue,
      })),
    [t],
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
