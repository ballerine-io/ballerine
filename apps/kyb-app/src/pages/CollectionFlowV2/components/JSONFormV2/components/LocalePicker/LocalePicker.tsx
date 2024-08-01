import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';

export const LocalePicker = (props: RJSFInputProps) => {
  const { t } = useTranslation();

  props.schema.oneOf = useMemo(() => t('languages', { returnObjects: true }), [t]) as {
    const: string;
    title: string;
  }[];

  return <TextInputAdapter {...(props as any)} />;
};
