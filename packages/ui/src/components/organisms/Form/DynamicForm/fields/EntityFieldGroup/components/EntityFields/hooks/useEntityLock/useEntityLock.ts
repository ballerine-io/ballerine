import { useField } from '@/components/organisms/Form/DynamicForm/hooks/external';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useCallback, useMemo } from 'react';

export const useEntityLock = (
  element: IFormElement<any, any>,
  stack: TDeepthLevelStack,
  index: number,
) => {
  const { value, onChange } = useField<Array<{ __isLocked?: boolean }>>(element, stack);

  const entity = useMemo(() => {
    return value?.[index];
  }, [value, index]);

  const isLocked = useMemo(() => {
    return Boolean(entity?.__isLocked);
  }, [entity]);

  const lockEntity = useCallback(() => {
    const updatedArray = value.map((item, internalIndex) => {
      if (internalIndex === index) {
        return { ...item, __isLocked: true };
      }

      return item;
    });

    onChange(updatedArray);
  }, [onChange, index, value]);

  const unlockEntity = useCallback(() => {
    const updatedArray = value.map((item, internalIndex) => {
      if (internalIndex === index) {
        const entity = {
          ...item,
        };

        delete entity.__isLocked;

        return entity;
      }

      return item;
    });

    onChange(updatedArray);
  }, [onChange, index, value]);

  return { isLocked, lockEntity, unlockEntity };
};
