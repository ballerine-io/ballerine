import { isAxiosError } from 'axios';
import jsonata from 'jsonata';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useDynamicForm } from '../../../../context';
import { useField } from '../../../../hooks/external';
import { useStack } from '../../../FieldList';
import { IEntity } from '../../types';
import { useFormHttp } from '../../../../hooks/internal/useFormHttp/useFormHttp';
import { GetUIElementByType } from '@ballerine/common';

export interface IUseFieldListProps {
  element: GetUIElementByType<'entityfieldgroup'>;
}

export const useEntityFieldGroupList = ({ element }: IUseFieldListProps) => {
  const { stack } = useStack();
  const { onChange, value } = useField<IEntity[] | undefined>(element, stack);
  const { values } = useDynamicForm();

  const { run: deleteEntity, isLoading } = useFormHttp(element.params!.httpParams?.deleteEntity);

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
