import React, { FunctionComponent, useMemo } from 'react';
import { Send } from 'lucide-react';
import { Badge } from '@ballerine/ui';
import { StateTag } from '@ballerine/common';
import { DialogClose } from '@radix-ui/react-dialog';

import { IActionsProps } from './interfaces';
import { useActions } from './hooks/useActions/useActions';
import { ctw } from '../../../../common/utils/ctw/ctw';
import {
  AssignButton,
  Assignee,
} from '../../../../common/components/atoms/AssignButton/AssignButton';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { convertSnakeCaseToTitleCase } from '../../hooks/useEntity/utils';

const tagToBadgeData = {
  [StateTag.APPROVED]: { variant: 'success', text: 'Approved' },
  [StateTag.REVISION]: { variant: 'warning', text: 'Revisions' },
  [StateTag.REJECTED]: { variant: 'destructive', text: 'Rejected' },
  [StateTag.MANUAL_REVIEW]: { variant: 'info', text: 'Manual Review' },
} as const;

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
  showResolutionButtons,
}) => {
  const {
    onMutateApproveEntity,
    onMutateRevisionCase,
    onMutateRejectEntity,
    onMutateAssignWorkflow,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingRevisionCase,
    isLoading,
    isLoadingCase,
    canApprove,
    canReject,
    canRevision,
    caseState,
    tags,
    authenticatedUser,
    assignees,
    onTriggerAssignToMe,
    hasDecision,
    documentsToReviseCount,
  } = useActions({ workflowId: id, fullName });

  const tag = useMemo(() => tags?.find(t => tagToBadgeData[t]), [tags]);

  return (
    <div className={`sticky top-0 z-50 col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
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
        <div className={`flex flex-col space-y-4`}>
          <h2
            className={ctw(`text-2xl font-bold`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingCase,
            })}
          >
            {fullName}
          </h2>
          {tag ? (
            <div className={`flex items-center`}>
              <span className={`mr-[8px] text-sm font-bold`}>Status</span>
              <Badge
                variant={tagToBadgeData[tag].variant}
                className={ctw(`text-sm font-bold`, {
                  'bg-info/20 text-info': tag === StateTag.MANUAL_REVIEW,
                })}
              >
                {convertSnakeCaseToTitleCase(tagToBadgeData[tag].text)}
              </Badge>
            </div>
          ) : null}
        </div>
        {showResolutionButtons && (
          <div className={`flex items-center space-x-6 pe-[3.35rem]`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className={ctw('bg-orange-400 hover:!bg-orange-400/90', {
                    loading: debouncedIsLoadingRejectEntity,
                  })}
                  disabled={isLoading || !canRevision}
                >
                  Ask for all re-uploads {canRevision && `(${documentsToReviseCount})`}
                </Button>
              </DialogTrigger>
              <DialogContent className={`mb-96`}>
                <DialogHeader>
                  <DialogTitle className={`text-2xl`}>Ask for all re-uploads</DialogTitle>
                  <DialogDescription>
                    <div className="mb-[10px]">
                      By clicking the button below, an email with a link will be sent to the
                      customer, directing them to re-upload the documents you have marked as
                      “re-upload needed”.
                    </div>
                    <div>
                      The case’s status will then change to “Revisions” until the customer will
                      provide the needed documents and fixes.
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      className={ctw(`gap-x-2`, {
                        loading: debouncedIsLoadingRevisionCase,
                      })}
                      disabled={isLoading || !canRevision}
                      onClick={onMutateRevisionCase}
                    >
                      <Send size={18} />
                      Send email
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
