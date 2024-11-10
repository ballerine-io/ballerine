import { Badge } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';
import { StateTag } from '@ballerine/common';

import { tagToBadgeData } from './consts';
import { ctw } from '@/common/utils/ctw/ctw';
import { IActionsProps } from './interfaces';
import { NotesButton } from '@/common/components/molecules/NotesButton/NotesButton';
import { useCaseActionsLogic } from './hooks/useCaseActionsLogic/useCaseActionsLogic';
import { AssignDropdown } from '@/common/components/atoms/AssignDropdown/AssignDropdown';
import { CaseOptions } from '@/pages/Entity/components/Case/components/CaseOptions/CaseOptions';
import { ActionsVariant } from '@/pages/Entity/components/Case/actions-variants/ActionsVariant/ActionsVariant';
import { Avatar } from '@/common/components/atoms/Avatar';
import { stringToRGB } from '@/common/utils/string-to-rgb/string-to-rgb';
import { createInitials } from '@/common/utils/create-initials/create-initials';

/**
 * @description To be used by {@link Case}. Displays the entity's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the reject/approve mutation.
 * @param props.fullName - The full name of the entity.
 * @param props.showResolutionButtons - Whether to show the reject/approve buttons.
 *
 * @see {@link Case}
 *
 * @constructor
 */
export const Actions: FunctionComponent<IActionsProps> = ({
  id,
  fullName,
  numberOfNotes,
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
    isWorkflowCompleted,
    avatarUrl,
  } = useCaseActionsLogic({ workflowId: id, fullName });

  const entityInitials = createInitials(fullName);
  const rgb = useMemo(() => stringToRGB(fullName), [fullName]);

  return (
    <div className={`col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
      <div className={`mb-8 flex flex-row justify-between space-x-3.5`}>
        <AssignDropdown
          assignedUser={assignedUser}
          assignees={assignees}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, id === authenticatedUser?.id);
          }}
          authenticatedUserId={authenticatedUser?.id}
          isDisabled={isWorkflowCompleted}
        />
        <CaseOptions />
      </div>
      <div className={`min-h-20 flex justify-between gap-4`}>
        <div className={`flex flex-col space-y-3`}>
          <div className={`flex space-x-4`}>
            <Avatar
              src={avatarUrl}
              className="text-base font-semibold d-8"
              alt={`${fullName}'s avatar`}
              placeholder={entityInitials}
              style={{
                color: `rgb(${rgb})`,
                backgroundColor: `rgba(${rgb}, 0.2)`,
              }}
            />
            <h2
              className={ctw(`w-full max-w-[35ch] break-all text-2xl font-semibold leading-9`, {
                'h-8 w-full max-w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                  isLoadingCase,
              })}
            >
              {fullName}
            </h2>
          </div>
          <div className={`flex items-center space-x-6`}>
            {tag && (
              <div className={`flex space-x-2`}>
                <span className={`me-2 text-sm leading-6`}>Status</span>
                <Badge
                  variant={tagToBadgeData[tag].variant}
                  className={ctw(`whitespace-nowrap text-sm font-bold`, {
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
            <NotesButton numberOfNotes={numberOfNotes} />
          </div>
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
