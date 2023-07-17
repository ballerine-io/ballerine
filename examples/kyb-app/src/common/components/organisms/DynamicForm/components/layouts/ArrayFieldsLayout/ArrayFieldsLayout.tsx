import * as React from 'react';
import { Button } from '@ballerine/ui/dist/components/atoms/Button';
import { ArrayFieldTemplateProps } from '@rjsf/utils';
import { Plus } from 'lucide-react';

export const ArrayFieldsLayout = ({
  title,
  schema,
  items,
  canAdd,
  onAddClick,
}: ArrayFieldTemplateProps) => {
  return (
    <div>
      <p className="pb-1 text-xl font-semibold">{title}</p>
      <p className="text-muted-foreground pb-4 text-sm">{schema.description}</p>
      {items.map(element => (
        <React.Fragment key={element.index}>{element.children}</React.Fragment>
      ))}
      {canAdd ? (
        <Button type="button" variant="outline" className="flex gap-2" onClick={onAddClick}>
          <Plus size="16" />
          Add Shareholder
        </Button>
      ) : null}
    </div>
  );
};
