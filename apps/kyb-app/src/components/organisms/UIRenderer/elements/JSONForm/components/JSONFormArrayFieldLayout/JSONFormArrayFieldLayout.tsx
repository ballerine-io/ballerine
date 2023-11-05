import { ArrayInsertionStrategy } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/array.insertion-strategy';
import {
  AnyObject,
  ArrayFieldsLayout,
  ArrayFieldsLayoutItem,
  ArrayFieldsLayoutProps,
} from '@ballerine/ui';

export const JSONFormArrayFieldLayout = (props: ArrayFieldsLayoutProps) => {
  return (
    <ArrayFieldsLayout {...props}>
      {(items, uiSchema) =>
        items.map((item, index) => (
          <ArrayFieldsLayoutItem
            key={`field-template-item-${index}`}
            element={item}
            uiSchema={uiSchema}
            disableDeletion={ArrayInsertionStrategy.isValueInserted(
              (item?.children?.props as AnyObject)?.formData || {},
            )}
          />
        ))
      }
    </ArrayFieldsLayout>
  );
};
