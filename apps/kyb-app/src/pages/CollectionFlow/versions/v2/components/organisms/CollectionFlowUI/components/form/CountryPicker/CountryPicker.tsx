import {
  COUNTRY_PICKER_FIELD_ELEMENT_TYPE,
  getCountries,
  TCountryPickerFieldParams,
} from '@ballerine/common';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { IFormElement, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';

export const CountryPickerField: TDynamicFormField<TCountryPickerFieldParams> = ({ element }) => {
  const { language } = useLanguageParam();

  const elementDefinitionWithCountryList: IFormElement<
    typeof COUNTRY_PICKER_FIELD_ELEMENT_TYPE,
    TCountryPickerFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: COUNTRY_PICKER_FIELD_ELEMENT_TYPE,
      params: {
        ...element.params,
        options: getCountries(language).map(country => ({
          value: country.const as string,
          label: country.title as string,
        })),
      },
    };
  }, [element, language]);

  return <SelectField element={elementDefinitionWithCountryList} />;
};
