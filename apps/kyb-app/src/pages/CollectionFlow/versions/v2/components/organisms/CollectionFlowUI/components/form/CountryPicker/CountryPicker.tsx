import { getCountries } from '@ballerine/common';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { IFormElement, ISelectFieldParams, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';

export const COUNTRY_PICKER_FIELD_TYPE = 'countrypickerfield';

export const CountryPickerField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  const { language } = useLanguageParam();

  const elementDefinitionWithCountryList: IFormElement<
    typeof COUNTRY_PICKER_FIELD_TYPE,
    ISelectFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: COUNTRY_PICKER_FIELD_TYPE,
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
