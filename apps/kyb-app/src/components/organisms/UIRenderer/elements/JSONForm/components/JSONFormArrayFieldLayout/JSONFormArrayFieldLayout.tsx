import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines';
import { useJSONFormDefinition } from '@/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { ArrayInsertionStrategy } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/array.insertion-strategy';
import {
  AnyObject,
  ArrayFieldsLayout,
  ArrayFieldsLayoutItem,
  ArrayFieldsLayoutItemTitle,
  ArrayFieldsLayoutProps,
} from '@ballerine/ui';
import { useCallback, useMemo } from 'react';
import pullAt from 'lodash/pullAt';
import get from 'lodash/get';
import set from 'lodash/set';

const jsonLogicRuleEngine = new JsonLogicRuleEngine();

export const JSONFormArrayFieldLayout = (props: ArrayFieldsLayoutProps) => {
  const { definition } = useJSONFormDefinition();
  const { stateApi, payload } = useStateManagerContext();
  const isNewItemsCanBeAdded = useMemo(() => {
    if (!Array.isArray(definition?.options?.canAdd)) return true;

    return definition?.options?.canAdd.length
      ? definition?.options?.canAdd.every(rule => jsonLogicRuleEngine.test(payload, rule))
      : true;
  }, [payload, definition]);

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

  // JSONForm items and context data not in sync, so when new items in json form are only visual.
  // Items appears in context as soon as user inputs something to any of fields.
  // To make validation properly handle addition of items we have to push empty object to array at destination.
  const addEmptyElementToDestinationArray = useCallback(() => {
    let value: undefined | any[] = get(payload, definition.valueDestination as string);

    if (Array.isArray(value)) {
      value.push({});
    } else {
      value = [{}];
    }

    set(payload, definition.valueDestination as string, value);

    stateApi.setContext(payload);
  }, [definition, payload, stateApi]);

  return (
    <ArrayFieldsLayout
      {...props}
      canAdd={isNewItemsCanBeAdded}
      onAddClick={addEmptyElementToDestinationArray}
    >
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
