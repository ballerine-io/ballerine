import { useContext } from 'react';
import { EntityFieldContext } from '../../../entity-field-group-type.context';

export const useEntityField = () => {
  const context = useContext(EntityFieldContext);

  if (!context) {
    throw new Error('useEntityField must be used within a EntityFieldGroupTypeProvider');
  }

  return context;
};
