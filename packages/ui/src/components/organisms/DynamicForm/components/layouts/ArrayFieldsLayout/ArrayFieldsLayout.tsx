import { AnyObject } from '@common/types';
import { Button } from '@components/atoms';
import { ArrayFieldsLayoutItem } from '@components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout/ArrayFieldsLayoutItem';
import { ArrayFieldTemplateItemType, ArrayFieldTemplateProps, RJSFSchema } from '@rjsf/utils';
import { Plus } from 'lucide-react';

export type ArrayFieldLayoutItem = ArrayFieldTemplateItemType<any, RJSFSchema, any>;
export interface ArrayFieldsLayoutProps extends ArrayFieldTemplateProps {
  children?: (items: ArrayFieldLayoutItem[], uiSchema: AnyObject) => JSX.Element[];
}

export const ArrayFieldsLayout = ({
  title,
  items,
  canAdd,
  uiSchema,
  onAddClick,
  children,
}: ArrayFieldsLayoutProps) => {
  const { addText = 'Add' } = uiSchema as AnyObject;

  return (
    <div>
      <p className="pb-1 text-xl font-semibold">{title}</p>
      {children
        ? children(items, uiSchema)
        : items.map((element, index) => (
            <ArrayFieldsLayoutItem
              key={`field-template-item-${index}`}
              element={element}
              uiSchema={uiSchema}
            />
          ))}
      {canAdd ? (
        <Button type="button" variant="outline" className="flex gap-2" onClick={onAddClick}>
          <Plus size="16" />
          {addText}
        </Button>
      ) : null}
    </div>
  );
};
