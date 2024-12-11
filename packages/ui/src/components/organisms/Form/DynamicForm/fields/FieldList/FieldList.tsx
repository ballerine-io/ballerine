import { AnyObject } from '@/common';
import { Button } from '@/components/atoms';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import { useDynamicForm } from '../../context';
import { TBaseFormElements, TDynamicFormElement } from '../../types';
import { useFieldList } from './hooks/useFieldList';
import { StackProvider, useStack } from './providers/StackProvider';

export type TFieldListValueType<T extends { _id: string }> = T[];

export interface IFieldListOptions {
  defaultValue: AnyObject;
  addButtonLabel?: string;
  removeButtonLabel?: string;
}

export const FieldList: TDynamicFormElement<
  TBaseFormElements,
  { addButtonLabel: string; removeButtonLabel: string }
> = props => {
  const { elementsMap } = useDynamicForm();
  const { stack } = useStack();
  const { element } = props;
  const { addButtonLabel = 'Add Item', removeButtonLabel = 'Remove' } = element.params || {};
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
              <Renderer
                elements={element.children || []}
                schema={elementsMap as unknown as TRendererSchema}
              />
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
