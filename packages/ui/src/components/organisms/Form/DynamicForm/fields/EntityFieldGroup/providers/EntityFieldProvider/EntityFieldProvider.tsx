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
}: IEntityFieldProviderProps) => {
  const context = useMemo(
    () => ({
      entityFieldGroupType,
      isSyncing,
    }),
    [entityFieldGroupType, isSyncing],
  );

  return <EntityFieldContext.Provider value={context}>{children}</EntityFieldContext.Provider>;
};
