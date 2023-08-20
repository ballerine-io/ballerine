import React, { FunctionComponent } from 'react';
import { IActionsProps } from './interfaces';
import { useActions } from './hooks/useActions/useActions';
import { ctw } from '../../../../common/utils/ctw/ctw';
import {
  AssignButton,
  Assignee,
} from '../../../../common/components/atoms/AssignButton/AssignButton';
import { Button } from '../../../../common/components/atoms/Button/Button';

/**
 * @description To be used by {@link Case}. Displays the entity's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the reject/approve mutation.
 * @param props.fullName - The full name of the entity.
 * @param props.avatarUrl - The entity's image url to pass into {@link Avatar}.
 *
 * @see {@link Case}
 * @see {@link Avatar}
 *
 * @constructor
 */
export const Actions: FunctionComponent<IActionsProps> = ({
  id,
  fullName,
  showResolutionButtons = true,
}) => {
  const {
    onMutateApproveEntity,
    onMutateRevisionCase,
    onMutateRejectEntity,
    onMutateAssignWorkflow,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingAssignEntity,
    isLoading,
    isLoadingCase,
    initials,
    canApprove,
    canReject,
    canRevision,
    caseState,
    authenticatedUser,
    assignees,
    isActionButtonDisabled,
    onTriggerAssignToMe,
    isAssignedToMe,
    hasDecision,
    documentsToReviseCount,
  } = useActions({ workflowId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 bg-base-100 px-4 pt-4`}>
      <div className={`flex flex-row space-x-3.5`}>
        <AssignButton
          assignees={[
            {
              id: authenticatedUser?.id,
              fullName: authenticatedUser?.fullName,
            },
          ]}
          authenticatedUser={authenticatedUser}
          caseState={caseState}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, onTriggerAssignToMe);
          }}
          buttonType={'Assign'}
          hasDecision={hasDecision}
        />
        <AssignButton
          assignees={assignees as Assignee[]}
          authenticatedUser={authenticatedUser}
          caseState={caseState}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, !onTriggerAssignToMe);
          }}
          buttonType={'Re-Assign'}
          hasDecision={hasDecision}
        />
      </div>
      <div className={`flex h-20 justify-between`}>
        <div className={`flex items-center space-x-8`}>
          <h2
            className={ctw(`text-2xl font-bold`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingCase,
            })}
          >
            {fullName}
          </h2>
        </div>
        {showResolutionButtons && (
          <div className={`flex items-center space-x-6 pe-[3.35rem]`}>
            <Button
              className={ctw('bg-orange-400 hover:!bg-orange-400/90', {
                loading: debouncedIsLoadingRejectEntity,
              })}
              disabled={isLoading || !canRevision}
              onClick={onMutateRevisionCase}
            >
              Ask for all re-uploads {canRevision && `(${documentsToReviseCount})`}
            </Button>
            <Button
              variant={`destructive`}
              className={ctw({
                loading: debouncedIsLoadingRejectEntity,
              })}
              disabled={isLoading || !canReject}
              onClick={onMutateRejectEntity}
            >
              Reject
            </Button>
            <Button
              className={ctw({
                loading: debouncedIsLoadingApproveEntity,
              })}
              variant={`success`}
              disabled={isLoading || !canApprove}
              onClick={onMutateApproveEntity}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
