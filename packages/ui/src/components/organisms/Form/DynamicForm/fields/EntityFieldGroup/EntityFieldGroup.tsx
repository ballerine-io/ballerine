import { AnyObject } from '@/common';
import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useMemo } from 'react';
import { Toaster } from 'sonner';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { useTaskRunner } from '../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../providers/TaskRunner/types';
import { TDynamicFormField } from '../../types';
import { createOrUpdateDocumentInList } from '../DocumentField/hooks/useDocumentUpload/helpers/create-or-update-document-in-list';
import { IFieldListParams, useStack } from '../FieldList';
import { EntityFieldGroupDocument } from './components/EntityFieldGroupDocument';
import { DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_CREATION_PARAMS } from './components/EntityFieldGroupDocument/defaults';
import { EntityFields } from './components/EntityFields';
import { buildDocumentsCreationPayload } from './components/EntityFields/helpers/build-documents-creation-payload';
import { buildEntityCreationPayload } from './components/EntityFields/helpers/build-entity-for-creation';
import { buildEntityUpdatePayload } from './components/EntityFields/helpers/build-entity-for-update';
import { updateEntities } from './components/EntityFields/helpers/update-entities';
import { getEntityGroupValueDestination } from './helpers/get-entity-group-value-destination';
import { useEntityFieldGroupList } from './hooks/useEntityFieldGroupList';
import { EntityFieldProvider } from './providers/EntityFieldProvider';
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

  const { elementsMap, metadata } = useDynamicForm();
  const { stack } = useStack();
  const { id: fieldId, hidden } = useElement(element, stack);
  const { disabled, value, onChange } = useField<IEntity[]>(element, stack);
  const {
    addButtonLabel = 'Add Item',
    removeButtonLabel = 'Remove',
    itemIndexLabel = 'Item {INDEX}',
  } = element.params || {};
  const { items, isRemovingEntity, addItem, removeItem } = useEntityFieldGroupList({ element });
  const { run: createEntity, isLoading: isCreatingEntity } = useHttp(
    element.params!.httpParams?.createEntity.httpParams,
    metadata,
  );
  const { run: updateEntity, isLoading: isUpdatingEntity } = useHttp(
    element.params!.httpParams?.updateEntity.httpParams,
    metadata,
  );

  const { run: uploadDocument } = useHttp(
    element.params!.httpParams?.uploadDocument ||
      DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_CREATION_PARAMS,
    metadata,
  );
  const { addTask, removeTask } = useTaskRunner();
  const elementsOverride = useMemo(
    () => ({
      ...elementsMap,
      documentfield: EntityFieldGroupDocument,
    }),
    [elementsMap],
  );

  const createEntitiesCreationTaskOnChange = useCallback(async () => {
    const TASK_ID = element.id;
    removeTask(TASK_ID);

    try {
      const taskRun = async (context: AnyObject) => {
        const entities = get(context, element.valueDestination, []) as IEntity[];

        const entitiesToProcess = await Promise.all(
          entities.map(entity =>
            entity.ballerineEntityId
              ? buildEntityUpdatePayload(element, entity, context)
              : buildEntityCreationPayload(element, entity, context),
          ),
        );
        const createdEntitiesIds: string[] = await Promise.all(
          entitiesToProcess.map(entity =>
            entity.ballerineEntityId
              ? updateEntity(entity.entity, {
                  params: { entityId: entity.ballerineEntityId },
                })
              : createEntity(entity),
          ),
        );

        const documentsCreationPayload = buildDocumentsCreationPayload(
          element,
          createdEntitiesIds,
          context,
          stack,
        );

        await Promise.all(
          documentsCreationPayload.map(async documentData => {
            const uploadedDocument = await uploadDocument(documentData.payload);

            const updatedDocuments = createOrUpdateDocumentInList(
              get(context, documentData.valueDestination, []),
              documentData.documentDefinition,
              uploadedDocument,
            );

            set(context, documentData.valueDestination, updatedDocuments);

            return uploadedDocument;
          }),
        );

        const updatedEntities = updateEntities(entities, createdEntitiesIds);
        set(context, element.valueDestination, updatedEntities);

        onChange(updatedEntities);

        return context;
      };

      const task: ITask = {
        id: TASK_ID,
        element,
        run: taskRun,
      };

      addTask(task);
    } catch (error) {
      console.error(error);
    }
  }, [onChange, element, createEntity, uploadDocument, stack, removeTask, addTask, updateEntity]);

  useEffect(() => {
    void createEntitiesCreationTaskOnChange();
  }, [value, createEntitiesCreationTaskOnChange]);

  if (hidden) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4" data-testid={`${fieldId}-fieldlist`}>
      {items?.map((entity: IEntity, index: number) => {
        return (
          <EntityFieldProvider
            key={entity.__id || entity.ballerineEntityId}
            entityId={entity.ballerineEntityId}
            entityFieldGroupType={element.params?.type as TEntityFieldGroupType}
            isSyncing={isCreatingEntity || isUpdatingEntity}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm font-bold">
                  {itemIndexLabel.replace('{INDEX}', (index + 1).toString())}
                </span>
                <button
                  tabIndex={0}
                  aria-disabled={isRemovingEntity || disabled}
                  className="text-sm font-bold disabled:opacity-50"
                  disabled={isRemovingEntity || disabled}
                  data-testid={`${fieldId}-fieldlist-item-remove-${entity.__id}`}
                  onClick={isRemovingEntity ? undefined : () => removeItem(entity.__id!)}
                >
                  {removeButtonLabel}
                </button>
              </div>
              <EntityFields
                entityId={entity.__id!}
                index={index}
                stack={stack}
                fieldId={fieldId}
                element={element}
                elementsOverride={elementsOverride as AnyObject}
              />
            </div>
          </EntityFieldProvider>
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
      <Toaster />
    </div>
  );
};
