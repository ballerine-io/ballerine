import { GetUIElementByType } from '@ballerine/common';
import { TEntityFieldGroupType } from '../../EntityFieldGroup';

export interface IEntityFieldProviderContext {
  entityFieldGroupType?: TEntityFieldGroupType;
  entityId?: string;
  tempEntityId: string;
  isSyncing: boolean;
  element: GetUIElementByType<'entityfieldgroup'>;
}
