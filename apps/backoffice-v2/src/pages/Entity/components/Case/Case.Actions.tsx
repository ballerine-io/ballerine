import React, { FunctionComponent } from 'react';
import { Badge } from '@ballerine/ui';
import { StateTag } from '@ballerine/common';

import { IActionsProps } from './interfaces';
import { useCaseActionsLogic } from './hooks/useCaseActionsLogic/useCaseActionsLogic';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { AssignDropdown } from '../../../../common/components/atoms/AssignDropdown/AssignDropdown';
import { tagToBadgeData } from './consts';
import { ActionsVariant } from '@/pages/Entity/components/Case/actions-variants/ActionsVariant/ActionsVariant';

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
export const Actions: FunctionComponent<IActionsProps> = ({
  id,
  fullName,
  showResolutionButtons,
}) => {
  const {
    tag,
    assignedUser,
    authenticatedUser,
    isLoadingCase,
    assignees,
    onMutateAssignWorkflow,
    workflowDefinition,
  } = useCaseActionsLogic({ workflowId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
      <div className={`mb-8 flex flex-row space-x-3.5`}>
        <AssignDropdown
          assignedUser={assignedUser}
          assignees={assignees}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, id === authenticatedUser?.id);
          }}
          authenticatedUserId={authenticatedUser?.id}
        />
      </div>
      <div className={`flex h-20 justify-between`}>
        <div className={`flex flex-col space-y-3`}>
          <h2
            className={ctw(`text-4xl font-semibold leading-9`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingCase,
            })}
          >
            {fullName}
          </h2>
          {tag && (
            <div className={`flex items-center`}>
              <span className={`mr-[8px] text-sm leading-6`}>Status</span>
              <Badge
                variant={tagToBadgeData[tag].variant}
                className={ctw(`text-sm font-bold`, {
                  'bg-info/20 text-info': tag === StateTag.MANUAL_REVIEW,
                  'bg-violet-500/20 text-violet-500': [
                    StateTag.COLLECTION_FLOW,
                    StateTag.DATA_ENRICHMENT,
                  ].includes(tag),
                })}
              >
                {tagToBadgeData[tag].text}
              </Badge>
            </div>
          )}
        </div>
        {showResolutionButtons && workflowDefinition && (
          <ActionsVariant
            workflowDefinition={{
              version: workflowDefinition?.version,
              variant: workflowDefinition?.variant,
              config: workflowDefinition?.config,
            }}
          />
        )}
      </div>
    </div>
  );
};
