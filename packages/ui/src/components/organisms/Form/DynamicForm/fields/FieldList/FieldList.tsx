import { Button } from '@/components/atoms';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import { FocusEventHandler } from 'react';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { useFieldList } from './hooks/useFieldList';
import { StackProvider, useStack } from './providers/StackProvider';

export interface IFieldListParams {
  // jsonata expression
  defaultValue?: string;
  addButtonLabel?: string;
  itemIndexLabel?: string;
  removeButtonLabel?: string;
}

export const FieldList: TDynamicFormField<IFieldListParams> = props => {
  useMountEvent(props.element);
  useUnmountEvent(props.element);

  const { elementsMap } = useDynamicForm();
  const { stack } = useStack();
  const { element } = props;
  const { id: fieldId, hidden } = useElement(element, stack);
  const { disabled, onFocus, onBlur } = useField(element, stack);
  const {
    addButtonLabel = 'Add Item',
    removeButtonLabel = 'Remove',
    itemIndexLabel = 'Item {INDEX}',
  } = element.params || {};
  const { items, addItem, removeItem } = useFieldList({ element });

  if (hidden) {
    return null;
  }

  return (
    <div
      className="flex flex-col gap-4"
      data-testid={`${fieldId}-fieldlist`}
      tabIndex={0}
      onFocus={onFocus as FocusEventHandler<HTMLDivElement>}
      onBlur={onBlur as FocusEventHandler<HTMLDivElement>}
    >
      {items.map((_: unknown, index: number) => {
        return (
          <div
            key={`${fieldId}-${index}`}
            className="flex flex-col gap-2"
            data-testid={`${fieldId}-fieldlist-item-${index}`}
          >
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-bold">
                {itemIndexLabel.replace('{INDEX}', (index + 1).toString())}
              </span>
              <button
                tabIndex={0}
                disabled={disabled}
                aria-disabled={disabled}
                className="text-sm font-bold disabled:opacity-50"
                onClick={() => removeItem(index)}
                data-testid={`${fieldId}-fieldlist-item-remove-${index}`}
              >
                {removeButtonLabel}
              </button>
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
      <div className="flex flex-row justify-start">
        <Button
          onClick={addItem}
          disabled={disabled}
          className="border border-gray-200 bg-white text-[hsl(var(--muted-foreground))] shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] hover:bg-gray-50 hover:shadow-[0_1px_2px_0_rgb(0_0_0_/_0.1)]"
        >
          {addButtonLabel}
        </Button>
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </div>
  );
};
