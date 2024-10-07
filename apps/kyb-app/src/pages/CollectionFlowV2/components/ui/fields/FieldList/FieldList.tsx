import { useFieldList } from '@/pages/CollectionFlowV2/components/ui/fields/FieldList/hooks/useFieldList';
import {
  StackProvider,
  useStack,
} from '@/pages/CollectionFlowV2/components/ui/fields/FieldList/providers/StackProvider';
import { rendererSchema } from '@/pages/CollectionFlowV2/renderer-schema';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { AnyObject, Button, Renderer } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export type TFieldListValueType<T extends { _id: string }> = T[];

export interface IFieldListOptions {
  defaultValue: AnyObject;
  addButtonLabel?: string;
  removeButtonLabel?: string;
}

export const FieldList: FunctionComponent<
  IFieldComponentProps<TFieldListValueType<{ _id: string }>, IFieldListOptions>
> = props => {
  const { stack } = useStack();
  const { definition, options } = props;
  const { addButtonLabel = 'Add Item', removeButtonLabel = 'Remove' } = options || {};
  const { items, addItem, removeItem } = useFieldList(props);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => {
        return (
          <div key={item._id} className="flex flex-col gap-2">
            <div className="flex flex-row justify-end">
              <span className="cursor-pointer font-bold" onClick={() => removeItem(index)}>
                {removeButtonLabel}
              </span>
            </div>
            <StackProvider stack={[...(stack || []), index]}>
              <Renderer elements={definition.children || []} schema={rendererSchema} />
            </StackProvider>
          </div>
        );
      })}
      <div className="flex flex-row justify-end">
        <Button onClick={addItem}>{addButtonLabel}</Button>
      </div>
    </div>
  );
};
