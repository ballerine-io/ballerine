import { IEntity } from '../../../types';

export const updateEntities = (entitiesList: IEntity[], createdEntityIds: string[]) => {
  return entitiesList.map((entity, index) => {
    return {
      ...entity,
      ballerineEntityId: createdEntityIds[index],
    };
  });
};
