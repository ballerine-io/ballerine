import { useField } from '@/components/organisms/Form/DynamicForm/hooks/external';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useCallback, useMemo } from 'react';
import { IEntity } from '../../../../types';

export const useEntityLock = (
  entities: IEntity[],
  entityId: string,
  element: IFormElement<any, any>,
  stack: TDeepthLevelStack,
  onLock: (entity: IEntity) => void,
  onUnlock: (entity: IEntity) => void,
) => {
  const { onChange } = useField<IEntity[]>(element, stack);

  const entity = useMemo(() => {
    return entities?.find(entity => entity.__id === entityId);
  }, [entities, entityId]);

  const isLocked = useMemo(() => {
    // If the entity has an id, it it means its already created and should't be mutated.
    return Boolean(entity?.__isLocked);
  }, [entity]);

  const lockEntity = useCallback(() => {
    const updatedArray = entities.map(entity => {
      if (entity.__id === entityId) {
        const lockedEntity = { ...entity, __isLocked: true };
        onLock(lockedEntity);

        return lockedEntity;
      }

      return entity;
    });

    onChange(updatedArray);
  }, [onChange, entityId, entities, onLock]);

  const unlockEntity = useCallback(() => {
    const updatedArray = entities.map(entity => {
      if (entity.__id === entityId) {
        const newEntity = {
          ...entity,
        };

        delete newEntity.__isLocked;
        onUnlock(newEntity);

        return newEntity;
      }

      return entity;
    });

    onChange(updatedArray);
  }, [onChange, entityId, entities, onUnlock]);

  return { isLocked, lockEntity, unlockEntity };
};
