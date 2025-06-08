import {
  INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE,
  TIndustriesPickerFieldParams,
} from '@ballerine/common';
import { IFormElement, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const IndustriesPickerField: TDynamicFormField<TIndustriesPickerFieldParams> = ({
  element,
}) => {
  const { t } = useTranslation();

  const translatedIndustries = t('industries', { returnObjects: true }) as string[];

  const elementDefinitionWithIndustriesList: IFormElement<
    typeof INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE,
    TIndustriesPickerFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE,
      params: {
        ...element.params,
        options: translatedIndustries.map(industry => ({
          value: industry,
          label: industry,
        })),
      },
    };
  }, [element, translatedIndustries]);

  return <SelectField element={elementDefinitionWithIndustriesList} />;
};
