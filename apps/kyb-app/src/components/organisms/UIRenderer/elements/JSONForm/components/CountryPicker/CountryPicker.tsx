import { useMemo } from 'react';

import { getCountries } from '@/helpers/countries-data';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { TextInputAdapter } from '@ballerine/ui';

// @ts-ignore
export const CountryPicker = (props: (typeof TextInputAdapter)['props']) => {
  const { language } = useLanguageParam();

  props.schema.oneOf = useMemo(() => getCountries(language), [language]);

  return <TextInputAdapter {...props} />;
};
