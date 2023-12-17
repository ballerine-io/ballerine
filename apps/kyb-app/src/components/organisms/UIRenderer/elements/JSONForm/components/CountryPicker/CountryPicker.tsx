import { useMemo } from 'react';

import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { getCountries } from '@/helpers/countries-data';

export const CountryPicker = (props: RJSFInputProps) => {
  const { language } = useLanguageParam();

  props.schema.oneOf = useMemo(() => getCountries(language), [language]);

  return <TextInputAdapter {...(props as any)} />;
};
