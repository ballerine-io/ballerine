import { useMemo } from 'react';
import { EntityFieldContext } from './entity-field-group-type.context';
import { IEntityFieldProviderContext } from './types';

interface IEntityFieldProviderProps extends IEntityFieldProviderContext {
  children: React.ReactNode;
}

export const EntityFieldProvider = ({
  children,
  entityFieldGroupType,
  isSyncing,
  entityId,
  tempEntityId,
  element,
}: IEntityFieldProviderProps) => {
  const context = useMemo(
    () => ({
      entityFieldGroupType,
      isSyncing,
      entityId,
      tempEntityId,
      element,
    }),
    [entityFieldGroupType, isSyncing, entityId, tempEntityId, element],
  );

  return <EntityFieldContext.Provider value={context}>{children}</EntityFieldContext.Provider>;
};
