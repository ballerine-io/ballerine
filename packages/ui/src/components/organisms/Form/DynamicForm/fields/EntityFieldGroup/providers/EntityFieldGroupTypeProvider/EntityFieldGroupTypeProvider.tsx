import { useMemo } from 'react';
import { TEntityFieldGroupType } from '../../EntityFieldGroup';
import { EntityFieldGroupTypeContext } from './entity-field-group-type.context';

interface IEntityFieldGroupTypeProviderProps {
  children: React.ReactNode;
  entityFieldGroupType?: TEntityFieldGroupType;
}

export const EntityFieldGroupTypeProvider = ({
  children,
  entityFieldGroupType,
}: IEntityFieldGroupTypeProviderProps) => {
  const context = useMemo(
    () => ({
      entityFieldGroupType,
    }),
    [entityFieldGroupType],
  );

  return (
    <EntityFieldGroupTypeContext.Provider value={context}>
      {children}
    </EntityFieldGroupTypeContext.Provider>
  );
};
