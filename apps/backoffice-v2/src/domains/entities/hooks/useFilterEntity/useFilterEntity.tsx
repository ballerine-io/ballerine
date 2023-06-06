import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';

export const useFilterEntity = () => {
  const entity = useEntityType();

  return entity;
};
