import { AnyObject } from '@/common';
import { IHttpParams } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { useMemo } from 'react';
import { Toaster } from 'sonner';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { IFieldListParams, useStack } from '../FieldList';
import { EntityFieldGroupDocument } from './components/EntityFieldGroupDocument';
import { EntityFields } from './components/EntityFields';
import { getEntityGroupValueDestination } from './helpers/get-entity-group-value-destination';
import { useEntityFieldGroupList } from './hooks/useEntityFieldGroupList';
import { IEntity } from './types';

export type TEntityFieldGroupType = 'director' | 'ubo';

export interface ICreateEntityParams {
  httpParams: IHttpParams;
  transform?: string;
}

export interface IUpdateEntityParams {
  httpParams: IHttpParams;
  transform?: string;
}

export interface IEntityFieldGroupParams extends IFieldListParams {
  httpParams: {
    createEntity: ICreateEntityParams;
    deleteEntity: IHttpParams;
    uploadDocument: IHttpParams;
    updateEntity: IUpdateEntityParams;
    deleteDocument: IHttpParams;
  };
  createEntityText?: string;
  type: TEntityFieldGroupType;
}

export const EntityFieldGroup: TDynamicFormField<IEntityFieldGroupParams> = ({
  element: _element,
}) => {
  const element = useMemo(
    () => ({
      ..._element,
      valueDestination: getEntityGroupValueDestination(
        _element.params?.type as TEntityFieldGroupType,
      ),
    }),
    [_element],
  );

  useMountEvent(element);
  useUnmountEvent(element);

  const { elementsMap } = useDynamicForm();
  const { stack } = useStack();
  const { id: fieldId, hidden } = useElement(element, stack);
  const { disabled, onChange } = useField(element, stack);
  const { addButtonLabel = 'Add Item' } = element.params || {};
  const { items, isRemovingEntity, addItem, removeItem } = useEntityFieldGroupList({ element });

  const elementsOverride = useMemo(
    () => ({
      ...elementsMap,
      documentfield: EntityFieldGroupDocument,
    }),
    [elementsMap],
  );

  if (hidden) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4" data-testid={`${fieldId}-fieldlist`}>
      {items?.map((entity: IEntity, index: number) => {
        return (
          <EntityFields
            key={entity.id}
            entityId={entity.__id!}
            entity={entity}
            index={index}
            onRemoveClick={() => removeItem(entity.__id!)}
            stack={stack}
            fieldId={fieldId}
            element={element}
            elementsOverride={elementsOverride as AnyObject}
            isRemovingEntity={isRemovingEntity}
            onChange={onChange}
          />
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
      <Toaster />
    </div>
  );
};
