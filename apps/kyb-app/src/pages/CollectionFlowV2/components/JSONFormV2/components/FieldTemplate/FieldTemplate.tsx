import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useDynamicUIContextComposer } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContextComposer';
import { useRuleExecutor } from '@/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/domains/collection-flow';
import { findDefinitionByName } from '@/pages/CollectionFlowV2/components/JSONFormV2/helpers/findDefinitionByName';
import { useJSONFormDefinition } from '@/pages/CollectionFlowV2/components/JSONFormV2/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { AnyObject, FieldLayout } from '@ballerine/ui';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = useMemo(() => t('optionalLabel'), [t]);

  const { state } = useDynamicUIContextComposer();
  const { payload } = useStateManagerContext();
  const { definition } = useJSONFormDefinition();

  const fieldDefinition = useMemo(
    () =>
      findDefinitionByName(props.id.replace(/root_\d+_/g, ''), definition.elements || []) ||
      ({} as UIElement<AnyObject>),
    [props.id, definition.elements],
  );

  const rules = useMemo(() => fieldDefinition.requiredOn || [], [fieldDefinition.requiredOn]);

  const rulesResults = useRuleExecutor(payload, rules, fieldDefinition, state);

  const isRequired = useMemo(
    () => Boolean(fieldDefinition?.validation?.required || false),
    [fieldDefinition],
  );

  console.log({ fieldDefinition });

  return (
    <div className="max-w-[385px]">
      <FieldLayout {...props} required={isRequired} optionalLabel={optionalLabel} />
    </div>
  );
};
