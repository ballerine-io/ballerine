import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';

export const IndustriesPicker = (props: RJSFInputProps) => {
  const { t } = useTranslation();

  const translatedIndustries = t('industries', { returnObjects: true }) as string[];

  const options = useMemo(
    () =>
      translatedIndustries.map(industry => ({
        const: industry,
        title: industry,
      })),
    [translatedIndustries],
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
