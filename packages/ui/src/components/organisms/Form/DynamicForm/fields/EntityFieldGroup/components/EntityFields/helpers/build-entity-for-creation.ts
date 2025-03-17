import { AnyObject } from '@/common';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { IEntityFieldGroupParams, TEntityFieldGroupType } from '../../../EntityFieldGroup';
import { IEntity } from '../../../types';
import { transform } from '../utils/transform';

export const buildEntityCreationPayload = async (
  element: IFormElement<any, IEntityFieldGroupParams>,
  entity: IEntity,
  context: AnyObject,
): Promise<{ entity: IEntity; entityType: TEntityFieldGroupType; ballerineEntityId?: string }> => {
  const entityToCreate = element.params?.httpParams?.createEntity?.transform
    ? await transform(context, entity, element.params!.httpParams?.createEntity.transform)
    : entity;

  return {
    entity: entityToCreate,
    entityType: element.params?.type as TEntityFieldGroupType,
    ballerineEntityId: undefined,
  };
};
