import { getNationalities } from '@/helpers/countries-data';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, DropdownInput } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface INationalityFieldOptions {
  placeholder?: string;
}

export const NationalityField: FunctionComponent<
  IFieldComponentProps<string, INationalityFieldOptions>
> = ({ fieldProps, definition, options, stack }) => {
  const { value, disabled, onChange, onBlur } = fieldProps;
  const { placeholder = '' } = options || {};

  const { language } = useLanguageParam();
  const { t } = useTranslation();

  const nationalities = useMemo(() => getNationalities(language, t), [language, t]);

  const dropdownOptions = useMemo(() => {
    return nationalities.map(({ const: constValue, title }) => ({
      label: title,
      value: constValue,
    }));
  }, [nationalities]);

  return (
    <FieldLayout definition={definition} stack={stack}>
      <DropdownInput
        name={createTestId(definition, stack)}
        placeholdersParams={{ placeholder }}
        searchable
        options={dropdownOptions}
        value={value}
        disabled={disabled}
        testId={createTestId(definition, stack)}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
