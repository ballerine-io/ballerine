import { getNationalities } from '@ballerine/common';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { IFormElement, ISelectFieldParams, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const NATIONALITY_PICKER_FIELD_TYPE = 'nationalitypickerfield';

export const NationalityPickerField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  const { language } = useLanguageParam();
  const { t } = useTranslation();

  const elementWithNationalities: IFormElement<
    typeof NATIONALITY_PICKER_FIELD_TYPE,
    ISelectFieldParams
  > = useMemo(() => {
    const nationalities = getNationalities(language, t);

    return {
      ...element,
      element: NATIONALITY_PICKER_FIELD_TYPE,
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
