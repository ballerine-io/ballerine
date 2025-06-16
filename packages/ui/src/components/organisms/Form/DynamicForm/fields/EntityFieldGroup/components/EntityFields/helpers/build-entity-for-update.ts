import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { IEntityFieldGroupParams } from '../../../EntityFieldGroup';

import { AnyObject } from '@/common';
import { IEntity } from '../../../types';
import { transform } from '../utils/transform';

export const buildEntityUpdatePayload = async (
  element: IFormElement<any, IEntityFieldGroupParams>,
  entity: IEntity,
  context: AnyObject,
): Promise<{ entity: IEntity; ballerineEntityId?: string }> => {
  const entityToCreate = element.params?.httpParams?.createEntity?.transform
    ? await transform(context, entity, element.params!.httpParams?.createEntity.transform)
    : entity;

  return {
    entity: {
      ...entityToCreate,
      variant: entityToCreate.variant || element.params?.type,
    },
    ballerineEntityId: entity.ballerineEntityId,
  };
};
