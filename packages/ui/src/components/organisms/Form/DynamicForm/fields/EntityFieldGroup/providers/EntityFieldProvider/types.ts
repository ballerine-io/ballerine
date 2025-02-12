import { TEntityFieldGroupType } from '../../EntityFieldGroup';

export interface IEntityFieldProviderContext {
  entityFieldGroupType?: TEntityFieldGroupType;
  isSyncing: boolean;
}
