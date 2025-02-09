import { IEntity } from '../../../types';

export const updateEntities = (entitiesList: IEntity[], updatedEntity: IEntity) => {
  return entitiesList.map(entity => {
    if (entity.__id === updatedEntity.__id) {
      const newEntity = {
        ...entity,
        id: updatedEntity.id,
      };

      return newEntity;
    }

    return entity;
  });
};
