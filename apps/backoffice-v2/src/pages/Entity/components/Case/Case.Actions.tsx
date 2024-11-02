import { Badge } from '@ballerine/ui';
import { SquarePen } from 'lucide-react';
import { FunctionComponent } from 'react';
import { StateTag } from '@ballerine/common';

import { tagToBadgeData } from './consts';
import { ctw } from '@/common/utils/ctw/ctw';
import { IActionsProps } from './interfaces';
import { useCaseActionsLogic } from './hooks/useCaseActionsLogic/useCaseActionsLogic';
import { AssignDropdown } from '@/common/components/atoms/AssignDropdown/AssignDropdown';
import { CaseOptions } from '@/pages/Entity/components/Case/components/CaseOptions/CaseOptions';
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
    toggleNotes,
  } = useCaseActionsLogic({ workflowId: id, fullName });

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
          <h2
            className={ctw(`w-full max-w-[35ch] break-all text-4xl font-semibold leading-9`, {
              'h-8 w-full max-w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingCase,
            })}
          >
            {fullName}
          </h2>
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
            <div className={`flex items-center space-x-2`}>
              <span className={`me-2 text-sm leading-6`}>Notes</span>
              <div className={`relative flex cursor-pointer`} onClick={toggleNotes}>
                <SquarePen className={`d-5`} />
                {numberOfNotes > 0 && (
                  <div
                    className={ctw(
                      `absolute left-3 top-3 rounded-full bg-slate-600 text-center text-[10px] font-bold text-white`,
                      { 'd-[14px]': numberOfNotes < 10, 'h-[14px] w-5': numberOfNotes >= 10 },
                    )}
                  >
                    {numberOfNotes > 9 ? '+9' : numberOfNotes}
                  </div>
                )}
              </div>
            </div>
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
