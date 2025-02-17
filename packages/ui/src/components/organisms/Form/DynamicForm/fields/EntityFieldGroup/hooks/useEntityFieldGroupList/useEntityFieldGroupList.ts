import { useHttp } from '@/common/hooks/useHttp';
import { isAxiosError } from 'axios';
import jsonata from 'jsonata';
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
  const { metadata, values } = useDynamicForm();

  const { run: deleteEntity, isLoading } = useHttp(
    element.params!.httpParams?.deleteEntity,
    metadata,
  );

  const addItem = useCallback(async () => {
    let initialValue = {
      __id: crypto.randomUUID(),
    };
    const expression = element.params?.defaultValue;

    if (!expression) {
      console.log('Default value is missing for', element.id);
      onChange([...(value || []), initialValue]);

      return;
    }

    const result = await jsonata(expression).evaluate(values);

    initialValue = {
      ...initialValue,
      ...result,
    };

    onChange([...(value || []), initialValue]);
  }, [value, values, onChange, element.params?.defaultValue, element.id]);

  const removeItem = useCallback(
    async (id: string) => {
      if (!Array.isArray(value)) {
        return;
      }

      const entity = value.find(entity => entity.__id === id);

      if (entity?.ballerineEntityId) {
        try {
          await deleteEntity({}, { params: { entityId: entity.ballerineEntityId } });
        } catch (error) {
          if (!isAxiosError((error as any).response) && (error as any).response.status === 400) {
            toast.error(`Failed to delete ${element.params?.type || 'end-user'}.`);
          }

          console.error(error);
        }
      }

      const newValue = value.filter(entity => entity.__id !== id);
      onChange(newValue);
    },
    [value, element, deleteEntity, onChange],
  );

  return {
    items: value,
    isRemovingEntity: isLoading,
    addItem,
    removeItem,
  };
};
