import { useContext } from 'react';
import { EntityFieldGroupTypeContext } from '../../../entity-field-group-type.context';

export const useEntityFieldGroupType = () => {
  const context = useContext(EntityFieldGroupTypeContext);

  if (!context) {
    throw new Error('useEntityFieldGroupType must be used within a EntityFieldGroupTypeProvider');
  }

  return context;
};
