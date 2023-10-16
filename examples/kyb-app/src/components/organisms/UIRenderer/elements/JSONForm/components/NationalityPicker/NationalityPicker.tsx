import { RJSVInputProps, TextInputAdapter } from '@ballerine/ui';
import nationality from 'i18n-nationality';
import locale from 'i18n-nationality/langs/en.json';
import { useMemo } from 'react';
nationality.registerLocale(locale);

export const NationalityPicker = (props: RJSVInputProps) => {
  const options = useMemo(
    () =>
      Object.keys(nationality.getAlpha2Codes()).map(key => ({
        const: key,
        title: nationality.getName(key, 'en'),
      })),
    [],
  );

  props.schema.oneOf = options;

  return <TextInputAdapter {...(props as any)} />;
};
