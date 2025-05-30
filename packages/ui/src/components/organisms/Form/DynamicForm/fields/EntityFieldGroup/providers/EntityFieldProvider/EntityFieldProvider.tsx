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
}: IEntityFieldProviderProps) => {
  const context = useMemo(
    () => ({
      entityFieldGroupType,
      isSyncing,
      entityId,
      tempEntityId,
    }),
    [entityFieldGroupType, isSyncing, entityId, tempEntityId],
  );

  return <EntityFieldContext.Provider value={context}>{children}</EntityFieldContext.Provider>;
};
