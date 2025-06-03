import { StateTag } from '@ballerine/common';
import { Badge } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';

import { AssignDropdown } from '@/common/components/atoms/AssignDropdown/AssignDropdown';
import { Avatar } from '@/common/components/atoms/Avatar';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import { ctw } from '@/common/utils/ctw/ctw';
import { stringToRGB } from '@/common/utils/string-to-rgb/string-to-rgb';
import { NotesButton } from '@/domains/notes/NotesButton';
import { NotesSheet } from '@/domains/notes/NotesSheet';
import { ActionsVariant } from '@/pages/Entity/components/Case/actions-variants/ActionsVariant/ActionsVariant';
import { CaseOptions } from '@/pages/Entity/components/Case/components/CaseOptions/CaseOptions';
import { tagToBadgeData } from './consts';
import { useCaseActionsLogic } from './hooks/useCaseActionsLogic/useCaseActionsLogic';
import { IActionsProps } from './interfaces';

/**
 * @description To be used by {@link Case}. Displays the entity's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the reject/approve mutation.
 * @param props.entityId - The id of the selected entity to be used in the notes.
 * @param props.fullName - The full name of the entity.
 * @param props.showResolutionButtons - Whether to show the reject/approve buttons.
 *
 * @see {@link Case}
 *
 * @constructor
 */
export const Actions: FunctionComponent<IActionsProps> = ({
  id,
  entityId,
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
    isWorkflowCompleted,
    avatarUrl,
    notes,
    isNotesOpen,
    setIsNotesOpen,
    workflow,
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
          excludedRoles={['viewer']}
        />
        <CaseOptions />
      </div>
      <div className={`flex min-h-20 justify-between gap-4`}>
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
              className={ctw(
                `flex w-full max-w-[35ch] items-center break-all text-2xl font-semibold leading-9`,
                {
                  'h-8 w-full max-w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                    isLoadingCase,
                },
              )}
            >
              {fullName}
              {workflow?.config?.example === true && (
                <Badge className="ml-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-gray-100 px-1 py-0.5 text-xs text-gray-600">
                  Sample Data
                </Badge>
              )}
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
            <NotesSheet
              open={isNotesOpen}
              onOpenChange={setIsNotesOpen}
              modal={false}
              notes={notes ?? []}
              noteData={{
                entityId,
                entityType: `Business`,
                noteableId: id,
                noteableType: `Workflow`,
              }}
            >
              <NotesButton numberOfNotes={notes?.length ?? 0} />
            </NotesSheet>
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
