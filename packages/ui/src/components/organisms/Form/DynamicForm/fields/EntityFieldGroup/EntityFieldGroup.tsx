import { IHttpParams } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { Renderer } from '@/components/organisms/Renderer';
import { TRendererSchema } from '@/components/organisms/Renderer/types';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { IFieldListParams, useStack } from '../FieldList';
import { useFieldList } from '../FieldList/hooks/useFieldList';
import { StackProvider } from '../FieldList/providers/StackProvider';

export interface IEntityFieldGroupParams extends IFieldListParams {
  httpsParams: {
    createEntity: IHttpParams;
    deleteEntity: IHttpParams;
  };
}

export const EntityFieldGroup: TDynamicFormField<IEntityFieldGroupParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { elementsMap } = useDynamicForm();
  const { stack } = useStack();
  const { id: fieldId, hidden } = useElement(element, stack);
  const { disabled } = useField(element, stack);
  const { addButtonLabel = 'Add Item', removeButtonLabel = 'Remove' } = element.params || {};
  const { items, addItem, removeItem } = useFieldList({ element });

  if (hidden) {
    return null;
  }

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
