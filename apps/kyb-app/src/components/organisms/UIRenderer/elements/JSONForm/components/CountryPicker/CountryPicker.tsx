import { useMemo } from 'react';

import { TextInputAdapter } from '@ballerine/ui';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { getCountries } from '@/helpers/countries-data';

export const CountryPicker = (props: (typeof TextInputAdapter)['props']) => {
  const { language } = useLanguageParam();

  props.schema.oneOf = useMemo(() => getCountries(language), [language]);

  return <TextInputAdapter {...props} />;
};
