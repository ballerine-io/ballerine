import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import { useMemo } from 'react';
import { industries } from '@/common/static/industries';

export const IndustriesPicker = (props: RJSFInputProps) => {
  const options = useMemo(
    () =>
      industries.map(industry => ({
        const: industry,
        title: industry,
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
