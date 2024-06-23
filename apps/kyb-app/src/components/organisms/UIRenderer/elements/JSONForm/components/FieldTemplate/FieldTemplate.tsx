import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { findDefinitionByName } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { useJSONFormDefinition } from '@/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject, FieldLayout } from '@ballerine/ui';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = useMemo(() => t('optionalLabel'), [t]);

  const { state } = useDynamicUIContext();
  const { payload } = useStateManagerContext();
  const { definition } = useJSONFormDefinition();

  const fieldDefinition = useMemo(
    () =>
      findDefinitionByName(props.id.replace('root_', ''), definition.elements || []) ||
      ({} as UIElement<AnyObject>),
    [props.id, definition.elements],
  );

  const rules = useMemo(() => fieldDefinition.requiredOn || [], [fieldDefinition.requiredOn]);

  const rulesResults = useRuleExecutor(payload, rules, fieldDefinition, state);

  const isRequired = useMemo(
    () =>
      (Array.isArray(rulesResults) &&
        rulesResults.length &&
        rulesResults.every(item => item.isValid)) ||
      props.required,
    [rulesResults, props.required],
  );

  return <FieldLayout {...props} required={isRequired} optionalLabel={optionalLabel} />;
};
