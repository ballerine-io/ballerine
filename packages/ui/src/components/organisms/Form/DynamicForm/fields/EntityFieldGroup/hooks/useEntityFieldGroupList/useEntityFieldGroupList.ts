import { useHttp } from '@/common/hooks/useHttp';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useDynamicForm } from '../../../../context';
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
  const { onChange, value } = useField<IEntity[] | undefined>(element, stack);
  const { metadata } = useDynamicForm();

  const { run: deleteEntity, isLoading } = useHttp(
    element.params!.httpParams?.deleteEntity,
    metadata,
  );

  const addItem = useCallback(async () => {
    const initialEntity = {
      __id: crypto.randomUUID(),
    };
    onChange([...(value || []), initialEntity]);
  }, [value, onChange]);

  const removeItem = useCallback(
    async (id: string) => {
      if (!Array.isArray(value)) {
        return;
      }

      const entity = value.find(entity => entity.__id === id);

      if (entity?.id) {
        try {
          await deleteEntity({}, { params: { entityId: entity.id } });
        } catch (error) {
          toast.error('Failed to delete entity.');

          console.error(error);

          return;
        }
      }

      const newValue = value.filter(entity => entity.__id !== id);
      onChange(newValue);
    },
    [value, deleteEntity, onChange],
  );

  return {
    items: value,
    isRemovingEntity: isLoading,
    addItem,
    removeItem,
  };
};
