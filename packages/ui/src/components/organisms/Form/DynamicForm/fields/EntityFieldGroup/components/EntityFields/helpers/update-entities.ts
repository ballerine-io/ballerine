import { IEntity } from '../../../types';

export const updateEntities = (entitiesList: IEntity[], createdEntityIds: string[]) => {
  return entitiesList.map(({ __id, __isGeneratedAutomatically, ...entity }, index) => {
    return {
      ...entity,
      ballerineEntityId: createdEntityIds[index],
    };
  });
};
