import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { findDefinitionByName } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { getInputIndex } from '@/components/organisms/UIRenderer/elements/JSONForm/hocs/withDynamicUIInput';
import { useJSONFormDefinition } from '@/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject, FieldLayout } from '@ballerine/ui';
import { useClearValueOnHide } from '../../hooks/useClearValueOnHide/useClearValueOnHide';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = useMemo(() => t('optionalLabel'), [t]);

  const { state } = useDynamicUIContext();
  const { payload } = useStateManagerContext();
  const { definition } = useJSONFormDefinition();

  const inputIndex = useMemo(() => {
    const index = getInputIndex(props.id || '');

    return isNaN(index as number) ? null : index;
  }, [props.id]);

  const fieldDefinition = useMemo(
    () =>
      findDefinitionByName(props.id.replace(/root_\d*_?/, ''), definition.elements || []) ||
      ({} as UIElement<AnyObject>),
    [props.id, definition.elements],
  );

  const { hidden } = useUIElementProps(fieldDefinition, inputIndex);

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

  useClearValueOnHide(fieldDefinition, inputIndex);

  if (hidden) return null;

  return (
    <div className="max-w-[385px]">
      <FieldLayout {...props} required={isRequired} optionalLabel={optionalLabel} />
    </div>
  );
};
