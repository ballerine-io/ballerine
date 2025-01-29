import { useMemo } from 'react';

import { MCC } from '@/components/organisms/UIRenderer/elements/JSONForm/components/MCCPicker/options';
import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';

export const MCCPicker = (props: RJSFInputProps) => {
  const options = useMemo(() => {
    const list =
      (props.uiSchema?.['ui:options']?.mcc as Array<{ const: string; title: string }>) || MCC;

    return list.map(item => ({
      const: item.const,
      title: `${item.const} - ${item.title}`,
    }));
  }, [props.uiSchema]);

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
