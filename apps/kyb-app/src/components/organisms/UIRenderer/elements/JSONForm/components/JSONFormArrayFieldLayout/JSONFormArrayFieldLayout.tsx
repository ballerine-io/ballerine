import { useJSONFormDefinition } from '@/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { ArrayInsertionStrategy } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/array.insertion-strategy';
import {
  AnyObject,
  ArrayFieldsLayout,
  ArrayFieldsLayoutItem,
  ArrayFieldsLayoutItemTitle,
  ArrayFieldsLayoutProps,
} from '@ballerine/ui';
import { useCallback } from 'react';
import pullAt from 'lodash/pullAt';
import get from 'lodash/get';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';

export const JSONFormArrayFieldLayout = (props: ArrayFieldsLayoutProps) => {
  const { definition } = useJSONFormDefinition();
  const { stateApi } = useStateManagerContext();

  const removeElementOnDelete = useCallback(
    (index: number) => {
      const ctx = stateApi.getContext();
      const dataArray = get(ctx, definition.valueDestination as string);

      if (!dataArray) return;

      pullAt(dataArray, index);

      stateApi.setContext(ctx);
    },
    [definition, stateApi],
  );

  return (
    <ArrayFieldsLayout {...props}>
      {(items, uiSchema) =>
        items.map((item, index) => (
          <ArrayFieldsLayoutItem
            key={`field-template-item-${index}`}
            element={item}
            uiSchema={uiSchema}
            onDelete={removeElementOnDelete}
            title={
              typeof props.uiSchema?.titleTemplate === 'string' ? (
                <ArrayFieldsLayoutItemTitle index={index} template={props.uiSchema.titleTemplate} />
              ) : undefined
            }
            disableDeletion={ArrayInsertionStrategy.isValueInserted(
              (item?.children?.props as AnyObject)?.formData || {},
              definition.options?.insertionParams?.bindingAnchorDestination,
            )}
          />
        ))
      }
    </ArrayFieldsLayout>
  );
};
