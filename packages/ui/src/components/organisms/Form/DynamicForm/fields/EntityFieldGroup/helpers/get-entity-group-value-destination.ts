import { TEntityFieldGroupType } from '../EntityFieldGroup';

export const getEntityGroupValueDestination = (type: TEntityFieldGroupType) => {
  const destinationsMap: Record<TEntityFieldGroupType, string> = {
    director: 'entity.data.additionalInfo.directors',
    ubo: 'entity.data.additionalInfo.ubos',
  };

  const valueDestination = destinationsMap[type];

  if (!valueDestination) {
    throw new Error(`Invalid entity group type: ${type}`);
  }

  return valueDestination;
};
