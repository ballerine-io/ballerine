import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { findDefinitionByName } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { UIElement } from '@/domains/collection-flow';
import { useJSONFormDefinition } from '@/pages/CollectionFlowV2/components/JSONFormV2/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { AnyObject, FieldLayout } from '@ballerine/ui';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = useMemo(() => t('optionalLabel'), [t]);

  const { definition } = useJSONFormDefinition();

  const fieldDefinition = useMemo(
    () =>
      findDefinitionByName(props.id.replace(/root_\d+_/g, ''), definition.elements || []) ||
      ({} as UIElement<AnyObject>),
    [props.id, definition.elements],
  );

  const isRequired = useMemo(
    () => Boolean(fieldDefinition?.validation?.required || false),
    [fieldDefinition],
  );

  return (
    <div className="max-w-[385px]">
      <FieldLayout {...props} required={isRequired} optionalLabel={optionalLabel} />
    </div>
  );
};
