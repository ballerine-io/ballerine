import { IFormElement, ISelectFieldParams, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LOCALE_PICKER_FIELD_TYPE = 'localePickerField';

export const LocalePickerField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  const { t } = useTranslation();

  const elementDefinitionWithLocaleList: IFormElement<
    typeof LOCALE_PICKER_FIELD_TYPE,
    ISelectFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: LOCALE_PICKER_FIELD_TYPE,
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
