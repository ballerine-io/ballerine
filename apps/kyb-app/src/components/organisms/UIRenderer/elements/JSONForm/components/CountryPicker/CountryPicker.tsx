import { RJSVInputProps, TextInputAdapter } from '@ballerine/ui';
import { useMemo } from 'react';
import { getCountriesList } from './get-countries-list';

export const CountryPicker = (props: RJSVInputProps) => {
  const options = useMemo(() => getCountriesList(), []);

  props.schema.oneOf = options;

  return <TextInputAdapter {...(props as any)} />;
};
