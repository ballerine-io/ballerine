import { AnyObject } from '@/common/types';
import { Button } from '@/components/atoms';
import { ArrayFieldsLayoutItem } from '@/components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout/ArrayFieldsLayoutItem';
import { ArrayFieldsLayoutItemTitle } from '@/components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout/ArrayFieldsLayoutItemTitle';
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
        ? // @ts-ignore
          children(items, uiSchema)
        : items.map((element, index) => (
            <ArrayFieldsLayoutItem
              key={`field-template-item-${index}`}
              element={element}
              // @ts-ignore
              uiSchema={uiSchema}
              title={
                // @ts-ignore
                typeof uiSchema.titleTemplate === 'string' ? (
                  // @ts-ignore
                  <ArrayFieldsLayoutItemTitle template={uiSchema.titleTemplate} index={index} />
                ) : null
              }
            />
          ))}
      <Button
        type="button"
        variant="outline"
        className="flex gap-2"
        onClick={onAddClick}
        disabled={!canAdd}
      >
        <Plus size="16" />
        {addText}
      </Button>
    </div>
  );
};
