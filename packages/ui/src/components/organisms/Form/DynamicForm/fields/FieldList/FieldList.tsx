import { AnyObject } from '@/common';
import { Button } from '@/components/atoms';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import { useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { TDynamicFormField } from '../../types';
import { useFieldList } from './hooks/useFieldList';
import { StackProvider, useStack } from './providers/StackProvider';

export type TFieldListValueType<T extends { _id: string }> = T[];

export interface IFieldListParams {
  defaultValue: AnyObject;
  addButtonLabel?: string;
  removeButtonLabel?: string;
}

export const FieldList: TDynamicFormField<IFieldListParams> = props => {
  const { elementsMap } = useDynamicForm();
  const { stack } = useStack();
  const { element } = props;
  const { id: fieldId } = useElement(element, stack);
  const { addButtonLabel = 'Add Item', removeButtonLabel = 'Remove' } = element.params || {};
  const { items, addItem, removeItem } = useFieldList({ element });

  return (
    <div className="flex flex-col gap-4" data-testid={`${fieldId}-fieldlist`}>
      {items.map((_, index) => {
        return (
          <div
            key={`${fieldId}-${index}`}
            className="flex flex-col gap-2"
            data-testid={`${fieldId}-fieldlist-item-${index}`}
          >
            <div className="flex flex-row justify-end">
              <span
                className="cursor-pointer font-bold"
                onClick={() => removeItem(index)}
                data-testid={`${fieldId}-fieldlist-item-remove-${index}`}
              >
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
      <FieldErrors element={element} />
    </div>
  );
};
