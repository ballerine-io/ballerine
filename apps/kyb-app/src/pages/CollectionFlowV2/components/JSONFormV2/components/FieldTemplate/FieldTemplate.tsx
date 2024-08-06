import { FieldTemplateProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { findDefinitionByName } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { getInputIndex } from '@/components/organisms/UIRenderer/elements/JSONForm/hocs/withDynamicUIInput';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElement as IUIElement } from '@/domains/collection-flow';
import { useJSONFormDefinition } from '@/pages/CollectionFlowV2/components/JSONFormV2/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { transformV1UIElementToV2UIElement } from '@/pages/CollectionFlowV2/helpers';
import { AnyObject, FieldLayout } from '@ballerine/ui';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  const optionalLabel = useMemo(() => t('optionalLabel'), [t]);

  const { definition } = useJSONFormDefinition();
  const { payload } = useStateManagerContext();

  const fieldDefinition = useMemo(
    () =>
      findDefinitionByName(props.id.replace(/root_[\d]?_?/g, ''), definition.elements || []) ||
      ({} as IUIElement<AnyObject>),
    [props.id, definition.elements],
  );

  const uiElement = useMemo(() => {
    const inputIndex = getInputIndex(props.id);

    return new UIElement(
      transformV1UIElementToV2UIElement(fieldDefinition),
      payload,
      inputIndex !== null ? [inputIndex] : [],
    );
  }, [fieldDefinition, payload]);

  const isRequired = useMemo(() => uiElement.isRequired(), [uiElement]);

  return (
    <div className="max-w-[385px]">
      <FieldLayout {...props} required={isRequired} optionalLabel={optionalLabel} />
    </div>
  );
};
