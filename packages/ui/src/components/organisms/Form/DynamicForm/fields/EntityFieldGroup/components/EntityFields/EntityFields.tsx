import { AnyObject } from '@/common';
import { useHttp } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import get from 'lodash/get';
import set from 'lodash/set';
import { Check, Loader2, Trash2Icon, X } from 'lucide-react';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useDynamicForm } from '../../../../context';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { StackProvider } from '../../../FieldList/providers/StackProvider';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';
import { IEntity } from '../../types';
import { buildDocumentsCreationPayload } from './helpers/build-documents-creation-payload';
import { buildEntityCreationPayload } from './helpers/build-entity-for-creation';
import { updateEntities } from './helpers/update-entities';
import { useChildrenDisabledOnLock } from './hooks/useChildrenDisabledOnLock';
import { useEntityLock } from './hooks/useEntityLock';

interface IEntityFieldsProps {
  stack: TDeepthLevelStack;
  fieldId: string;
  entityId: string;
  entities: IEntity[];
  entity: IEntity;
  element: IFormElement<any, IEntityFieldGroupParams>;
  elementsOverride: TRendererSchema;
  isRemovingEntity?: boolean;
  index: number;
  onRemoveClick: () => void;
}

export const EntityFields: FunctionComponent<IEntityFieldsProps> = ({
  stack,
  fieldId,
  entityId,
  element,
  entity,
  elementsOverride,
  isRemovingEntity,
  index,
  entities,
  onRemoveClick,
}) => {
  const { metadata } = useDynamicForm();
  const { run: createEntity, isLoading: isCreatingEntity } = useHttp(
    element.params!.httpParams?.createEntity.httpParams,
    metadata,
  );
  const { run: uploadDocument, isLoading: isUploadingDocument } = useHttp(
    element.params!.httpParams?.uploadDocument,
    metadata,
  );

  const {
    lockText = 'This entity will be created on submission.',
    createdText = 'Entity created',
  } = element.params || {};

  const { addTask, removeTask } = useTaskRunner();

  const createEntityOnLockTask = useCallback(
    async (lockedEntity: IEntity) => {
      const task: ITask = {
        id: lockedEntity.__id!,
        element: element,
        run: async (context: AnyObject) => {
          const entitiesDestination = formatValueDestination(element.valueDestination, stack);

          const createEntityPayload = await buildEntityCreationPayload(
            element,
            lockedEntity,
            context,
          );

          let createdEntityId: string;

          try {
            createdEntityId = await createEntity(createEntityPayload);
          } catch (error) {
            console.error(error);
            toast.error('Failed to create entity.');
            throw error;
          }

          const entities = get(context, entitiesDestination, []);

          // UI Update
          const updatedEntities = updateEntities(entities, lockedEntity);
          set(context, entitiesDestination, updatedEntities);

          const documentsCreationPayload = await buildDocumentsCreationPayload(
            element,
            lockedEntity,
            context,
            {
              entityId: createdEntityId,
              workflowId: metadata.workflowId as string,
              stack: stack,
            },
          );

          const documentUploadPromises = documentsCreationPayload.map(async document => {
            const documentId = await uploadDocument(document.payload);

            set(context, document.valueDestination, documentId);

            return documentId;
          });

          try {
            await Promise.all(documentUploadPromises);
          } catch (error) {
            console.error(error);

            toast.error('Failed to upload documents.');
            throw error;
          }

          toast.success('Entity created successfully.');

          return context;
        },
      };

      addTask(task);
    },
    [addTask, stack, element, createEntity, uploadDocument, metadata],
  );

  const removeEntityOnUnlockTask = useCallback(
    async (entity: IEntity) => {
      removeTask(entity.__id!);
    },
    [removeTask],
  );

  const handleRemoval = useCallback(() => {
    removeTask(entityId);
    onRemoveClick();
  }, [removeTask, entityId, onRemoveClick]);

  const { isLocked, lockEntity, unlockEntity } = useEntityLock(
    entities,
    entityId,
    element,
    stack,
    createEntityOnLockTask,
    removeEntityOnUnlockTask,
  );
  const childrens = useChildrenDisabledOnLock(element, isLocked);

  const isShouldRenderLoading = useMemo(() => {
    return isRemovingEntity || isCreatingEntity;
  }, [isRemovingEntity, isCreatingEntity]);

  return (
    <div
      key={`${fieldId}-${entityId}`}
      className="flex flex-col gap-2"
      data-testid={`${fieldId}-fieldlist-item-${entityId}`}
    >
      <div className="flex flex-row justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={isLocked ? unlockEntity : lockEntity}
          disabled={isCreatingEntity || entity?.__isCreated}
        >
          {isLocked ? <X /> : <Check className="w-4 h-4 cursor-pointer font-bold" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={isShouldRenderLoading}
          onClick={isShouldRenderLoading ? undefined : handleRemoval}
        >
          {isShouldRenderLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2Icon
              className="w-4 h-4 cursor-pointer font-bold"
              data-testid={`${fieldId}-fieldlist-item-remove-${entityId}`}
            />
          )}
        </Button>
      </div>
      {isLocked && !entity?.__isCreated && <p className="text-xs text-green-400">{lockText}</p>}
      {entity?.__isCreated && <p className="text-xs text-green-400">{createdText}</p>}
      <StackProvider stack={[...(stack || []), index]}>
        <Renderer
          elements={childrens || []}
          schema={elementsOverride as unknown as TRendererSchema}
        />
      </StackProvider>
    </div>
  );
};
