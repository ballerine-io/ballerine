import { useJSONFormDefinition } from '@app/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider/useJSONFormDefinition';
import { ArrayInsertionStrategy } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/array.insertion-strategy';
import {
  AnyObject,
  ArrayFieldsLayout,
  ArrayFieldsLayoutItem,
  ArrayFieldsLayoutItemTitle,
  ArrayFieldsLayoutProps,
} from '@ballerine/ui';

export const JSONFormArrayFieldLayout = (props: ArrayFieldsLayoutProps) => {
  const { definition } = useJSONFormDefinition();

  return (
    <ArrayFieldsLayout {...props}>
      {(items, uiSchema) =>
        items.map((item, index) => (
          <ArrayFieldsLayoutItem
            key={`field-template-item-${index}`}
            element={item}
            uiSchema={uiSchema}
            title={
              typeof props.uiSchema.titleTemplate === 'string' ? (
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
