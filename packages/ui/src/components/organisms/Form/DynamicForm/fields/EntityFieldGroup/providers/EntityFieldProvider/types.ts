import { TEntityFieldGroupType } from '../../EntityFieldGroup';

export interface IEntityFieldProviderContext {
  entityFieldGroupType?: TEntityFieldGroupType;
  entityId?: string;
  tempEntityId: string;
  isSyncing: boolean;
}
