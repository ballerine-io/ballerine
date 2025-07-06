
import { AnyObject } from '@/common';
import { IEntity } from '../../../types';
import { transform } from '../utils/transform';
import { GetUIElementByType } from '@ballerine/common';

export const buildEntityUpdatePayload = async (
  element: GetUIElementByType<'entityfieldgroup'>,
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
