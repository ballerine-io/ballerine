import {
  getNationalities,
  NATIONALITY_PICKER_FIELD_ELEMENT_TYPE,
  TNationalityPickerFieldParams,
} from '@ballerine/common';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { IFormElement, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const NationalityPickerField: TDynamicFormField<TNationalityPickerFieldParams> = ({
  element,
}) => {
  const { language } = useLanguageParam();
  const { t } = useTranslation();

  const elementWithNationalities: IFormElement<
    typeof NATIONALITY_PICKER_FIELD_ELEMENT_TYPE,
    TNationalityPickerFieldParams
  > = useMemo(() => {
    const nationalities = getNationalities(language, t);

    return {
      ...element,
      element: NATIONALITY_PICKER_FIELD_ELEMENT_TYPE,
      params: {
        ...element.params,
        options: nationalities.map(nationality => ({
          value: nationality.const,
          label: nationality.title,
        })),
      },
    };
  }, [element, language, t]);

  return <SelectField element={elementWithNationalities} />;
};
