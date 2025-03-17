import { TEntityFieldGroupType } from '../../../EntityFieldGroup';

export const getEntityFieldGroupDocumentValueDestination = (type: TEntityFieldGroupType) => {
  const valueDestinationsMap: Record<TEntityFieldGroupType, string> = {
    director: 'entity.data.additionalInfo.directors[$0].additionalInfo.documents',
    ubo: 'entity.data.additionalInfo.ubos[$0].documents',
  };

  if (!valueDestinationsMap[type]) {
    throw new Error(`Invalid entity field group type in documentfield: ${type}`);
  }

  return valueDestinationsMap[type];
};
