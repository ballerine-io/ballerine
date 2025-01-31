import { AnyObject } from '@/common';
import { Button } from '@/components/atoms';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import get from 'lodash/get';
import set from 'lodash/set';
import { Check, Loader2, Trash2Icon, X } from 'lucide-react';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { ITask } from '../../../../providers/TaskRunner/types';
import { IFormElement } from '../../../../types';
import { StackProvider } from '../../../FieldList/providers/StackProvider';
import { IEntity } from '../../types';
import { delay } from '../../utils/delay';
import { useChildrenDisabledOnLock } from './hooks/useChildrenDisabledOnLock';
import { useEntityLock } from './hooks/useEntityLock';

interface IEntityFieldsProps {
  stack: TDeepthLevelStack;
  fieldId: string;
  entityId: string;
  entities: IEntity[];
  entity: IEntity;
  element: IFormElement<any, any>;
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
  // const { metadata } = useDynamicForm();
  // const { run: createEntity, isLoading: isCreatingEntity } = useHttp(
  //   element.params!.httpsParams?.createEntity,
  //   metadata,
  // );
  const [isCreatingEntity, setIsCreatingEntity] = useState(false);
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
          try {
            const entitiesDestination = formatValueDestination(element.valueDestination, stack);
            // Accessing entities list
            const entities = get(context, entitiesDestination, []);
            const documentFieldDefinitons =
              element.children?.filter(child => child.element === 'documentfield') || [];

            // Entities with documents
            const entitiesWithDocuments = entities.map((entity: IEntity, index: number) => {
              const entityWithDocument = { ...entity } as Record<string, any>;

              documentFieldDefinitons.forEach(documentDefinition => {
                const documentDestination = formatValueDestination(
                  documentDefinition.valueDestination,
                  [...(stack || []), index],
                );

                const documentFile = get(context, documentDestination);

                entityWithDocument[(documentDefinition.params as any).template.id] = documentFile;
              });

              return entityWithDocument;
            });

            // ENTITY CREATION HERE
            setIsCreatingEntity(true);
            await delay(1000);
            setIsCreatingEntity(false);

            // UI Update
            const updatedEntities = entities.map((entity: IEntity) => {
              if (entity.__id === lockedEntity.__id) {
                const newEntity = {
                  ...entity,
                  id: `${entity.__id}-${crypto.randomUUID()}`,
                };

                newEntity.__isCreated = true;

                return newEntity;
              }

              return entity;
            });
            set(context, entitiesDestination, updatedEntities);
            toast.success('Entity created successfully.');
            // Modify and return context here after creation

            return context;
          } catch (error) {
            toast.error('Failed to create entity.');
            console.error(error);

            return context;
          }
        },
      };

      addTask(task);
    },
    [addTask, stack, element],
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
