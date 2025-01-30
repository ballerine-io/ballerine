import { useCallback, useMemo } from 'react';
import { useField } from '../../../../hooks/external';
import { IFormElement } from '../../../../types';
import { useStack } from '../../../FieldList';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';
import { IEntity } from '../../types';

export interface IUseFieldListProps {
  element: IFormElement<string, IEntityFieldGroupParams>;
}

export const useEntityFieldGroupList = ({ element }: IUseFieldListProps) => {
  const { stack } = useStack();
  const { onChange, value: _value } = useField<IEntity[]>(element, stack);

  const value = useMemo(
    () =>
      _value?.map(entity => ({
        ...entity,
        __id: entity.id,
      })),
    [_value],
  );

  const addItem = useCallback(async () => {
    const initialEntity = {
      __id: crypto.randomUUID(),
    };
    onChange([...value, initialEntity]);
  }, [value, onChange]);

  const removeItem = useCallback(
    (id: string) => {
      if (!Array.isArray(value)) {
        return;
      }

      const newValue = value.filter(entity => entity.__id !== id);
      onChange(newValue);
    },
    [value, onChange],
  );

  return {
    items: value,
    addItem,
    removeItem,
  };
};
