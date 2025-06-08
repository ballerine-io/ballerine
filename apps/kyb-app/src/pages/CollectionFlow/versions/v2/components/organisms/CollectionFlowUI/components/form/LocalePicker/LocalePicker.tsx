import { LOCALE_PICKER_FIELD_ELEMENT_TYPE, TLocalePickerFieldParams } from '@ballerine/common';
import { IFormElement, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LocalePickerField: TDynamicFormField<TLocalePickerFieldParams> = ({ element }) => {
  const { t } = useTranslation();

  const elementDefinitionWithLocaleList: IFormElement<
    typeof LOCALE_PICKER_FIELD_ELEMENT_TYPE,
    TLocalePickerFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: LOCALE_PICKER_FIELD_ELEMENT_TYPE,
      params: {
        ...element.params,
        options: (
          t('languages', { returnObjects: true }) as Array<{
            const: string;
            title: string;
          }>
        ).map(locale => ({
          value: locale.const,
          label: locale.title,
        })),
      },
    };
  }, [element, t]);

  return <SelectField element={elementDefinitionWithLocaleList} />;
};
