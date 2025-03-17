import { IEntity } from '../../../types';

export const updateEntities = (entitiesList: IEntity[], createdEntityIds: string[]) => {
  return entitiesList.map((entity, index) => {
    delete entity.__id;
    delete entity.__isGeneratedAutomatically;

    return {
      ...entity,
      ballerineEntityId: createdEntityIds[index],
    };
  });
};
