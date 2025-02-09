import { useContext } from 'react';
import { EntityFieldContext } from '../../../entity-field-group-type.context';

export const useEntityFieldGroupType = () => {
  const context = useContext(EntityFieldContext);

  if (!context) {
    throw new Error('useEntityFieldGroupType must be used within a EntityFieldGroupTypeProvider');
  }

  return context;
};
