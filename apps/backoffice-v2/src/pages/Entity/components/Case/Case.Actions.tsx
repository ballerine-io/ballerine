import { FunctionComponent } from 'react';

import { CaseActionsVariantResolver } from '@/pages/Entity/components/Case/case-action-variants/CaseActionsVariantResolver';
import { IActionsProps } from './interfaces';

/**
 * @description To be used by {@link Case}. Displays the entity's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the reject/approve mutation.
 * @param props.fullName - The full name of the entity.
 * @param props.showResolutionButtons - Whether to show the reject/approve buttons.
 *
 * @see {@link Case}
 * @see {@link Avatar}
 *
 * @constructor
 */
export const Actions: FunctionComponent<IActionsProps> = props => {
  return <CaseActionsVariantResolver {...props} />;
};
