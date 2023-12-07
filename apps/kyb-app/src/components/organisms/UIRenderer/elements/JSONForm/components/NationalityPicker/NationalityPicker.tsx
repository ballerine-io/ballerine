import { useMemo } from 'react';

import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { getNationalities } from '@/helpers/countries-data';
import { useTranslation } from 'react-i18next';

export const NationalityPicker = (props: RJSFInputProps) => {
  const language = useLanguageParam();
  const { t } = useTranslation();

  const nationalities = useMemo(() => getNationalities(language || 'en', t), [language, t]);

  const propsWithOptions = useMemo(
    () => ({
      ...props,
      schema: {
        ...props.schema,
        oneOf: nationalities,
      },
    }),
    [props, nationalities],
  );

  return <TextInputAdapter {...(propsWithOptions as any)} />;
};
