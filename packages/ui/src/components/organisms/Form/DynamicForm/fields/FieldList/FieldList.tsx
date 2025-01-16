import { Button } from '@/components/atoms';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
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

export type TFieldListValueType<T extends { _id: string }> = T[];

export interface IFieldListParams {
  // jsonata expression
  defaultValue?: string;
  addButtonLabel?: string;
  removeButtonLabel?: string;
}

export const FieldList: TDynamicFormField<IFieldListParams> = props => {
  useMountEvent(props.element);
  useUnmountEvent(props.element);

  const { elementsMap } = useDynamicForm();
  const { stack } = useStack();
  const { element } = props;
  const { id: fieldId, hidden } = useElement(element, stack);
  const { disabled } = useField(element, stack);
  const { addButtonLabel = 'Add Item', removeButtonLabel = 'Remove' } = element.params || {};
  const { items, addItem, removeItem } = useFieldList({ element });

  if (hidden) return null;

  return (
    <div className="flex flex-col gap-4" data-testid={`${fieldId}-fieldlist`}>
      {items.map((_: unknown, index: number) => {
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
        <Button onClick={addItem} disabled={disabled}>
          {addButtonLabel}
        </Button>
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </div>
  );
};
