import { AnyObject } from '@/common';
import { TEntityFieldGroupType } from '../../../EntityFieldGroup';
import { IEntity } from '../../../types';
import { transform } from '../utils/transform';
import { GetUIElementByType } from '@ballerine/common';

export const buildEntityCreationPayload = async (
  element: GetUIElementByType<'entityfieldgroup'>,
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
