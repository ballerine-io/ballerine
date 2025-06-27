import { IFormElement } from '../../../../types';
import { IEntityFieldGroupParams, TEntityFieldGroupType } from '../../EntityFieldGroup';

export interface IEntityFieldProviderContext {
  entityFieldGroupType?: TEntityFieldGroupType;
  entityId?: string;
  tempEntityId: string;
  isSyncing: boolean;
  element: IFormElement<'entityfieldgroup', IEntityFieldGroupParams>;
}
