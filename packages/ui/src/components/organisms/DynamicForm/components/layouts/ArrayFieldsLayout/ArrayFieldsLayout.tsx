import { ArrayFieldTemplateProps } from '@rjsf/utils';
import { Plus } from 'lucide-react';
import { Button } from '@components/atoms';
import { AnyObject } from '@common/types';

export const ArrayFieldsLayout = ({
  title,
  items,
  canAdd,
  uiSchema,
  onAddClick,
}: ArrayFieldTemplateProps) => {
  const { addText = 'Add', removeText = 'Delete' } = uiSchema as AnyObject;

  return (
    <div>
      <p className="pb-1 text-xl font-semibold">{title}</p>
      {items.map(element => (
        <div key={element.index} className="relative flex flex-row flex-nowrap">
          <div className="flex-1">{element.children}</div>
          <span
            className="absolute right-0 top-0 cursor-pointer text-sm font-medium underline"
            onClick={element.onDropIndexClick(element.index)}
          >
            {removeText}
          </span>
        </div>
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
