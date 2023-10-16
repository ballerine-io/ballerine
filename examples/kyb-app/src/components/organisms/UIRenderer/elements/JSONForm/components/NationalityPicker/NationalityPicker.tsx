import { RJSVInputProps, TextInputAdapter } from '@ballerine/ui';
import locale from 'i18n-nationality/langs/en.json';
import { useMemo } from 'react';

export const NationalityPicker = (props: RJSVInputProps) => {
  const options = useMemo(
    () =>
      Object.entries(locale.nationalities).map(([alpha2Code, nationality]) => ({
        const: alpha2Code,
        title: nationality,
      })),
    [],
  );

  props.schema.oneOf = options;

  return <TextInputAdapter {...(props as any)} />;
};
