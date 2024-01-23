import { FieldLayout } from '@ballerine/ui';
import { FieldTemplateProps } from '@rjsf/utils';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = useMemo(() => t('optionalLabel'), [t]);

  return <FieldLayout {...props} optionalLabel={optionalLabel} />;
};
