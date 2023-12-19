import { FieldLayout } from '@ballerine/ui';
import { FieldTemplateProps } from '@rjsf/utils';
import { useTranslation } from 'react-i18next';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = t('optionalLabel');

  return <FieldLayout {...props} optionalLabel={optionalLabel} />;
};
