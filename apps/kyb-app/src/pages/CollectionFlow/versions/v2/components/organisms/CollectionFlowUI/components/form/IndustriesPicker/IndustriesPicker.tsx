import { IFormElement, ISelectFieldParams, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const INDUSTRIES_PICKER_FIELD_TYPE = 'industriespickerfield';

export const IndustriesPickerField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  const { t } = useTranslation();

  const translatedIndustries = t('industries', { returnObjects: true }) as string[];

  const elementDefinitionWithIndustriesList: IFormElement<
    typeof INDUSTRIES_PICKER_FIELD_TYPE,
    ISelectFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: INDUSTRIES_PICKER_FIELD_TYPE,
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
