import { RJSVInputProps, TextInputAdapter } from '@ballerine/ui';
import locale from './langs/en.json';
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

  const propsWithOptions = useMemo(
    () => ({
      ...props,
      schema: {
        ...props.schema,
        oneOf: options,
      },
    }),
    [props, options],
  );

  return <TextInputAdapter {...(propsWithOptions as any)} />;
};
