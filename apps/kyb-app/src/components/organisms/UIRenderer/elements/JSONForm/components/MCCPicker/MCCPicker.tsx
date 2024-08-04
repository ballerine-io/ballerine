import { useMemo } from 'react';

import { MCC } from '@/components/organisms/UIRenderer/elements/JSONForm/components/MCCPicker/options';
import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';

export const MCCPicker = (props: RJSFInputProps) => {
  const options = useMemo(
    () =>
      MCC.map(item => ({
        const: item.const,
        title: `${item.const} - ${item.title}`,
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

  console.log({ propsWithOptions });

  return <TextInputAdapter {...(propsWithOptions as any)} />;
};
