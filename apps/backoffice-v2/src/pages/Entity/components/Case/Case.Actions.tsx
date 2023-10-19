import React, { FunctionComponent } from 'react';
import { Send } from 'lucide-react';
import { Badge } from '@ballerine/ui';
import { StateTag } from '@ballerine/common';
import { DialogClose } from '@radix-ui/react-dialog';

import { IActionsProps } from './interfaces';
import { useCaseActionsLogic } from './hooks/useCaseActionsLogic/useCaseActionsLogic';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { AssignDropdown } from '../../../../common/components/atoms/AssignDropdown/AssignDropdown';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { tagToBadgeData } from './consts';
import { toTitleCase } from 'string-ts';

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
  avatarUrl,
  showResolutionButtons,
}) => {
  const {
    tag,
    assignedUser,
    authenticatedUser,
    isLoading,
    isLoadingCase,
    canApprove,
    canReject,
    canRevision,
    assignees,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingRevisionCase,
    documentsToReviseCount,
    onMutateApproveEntity,
    onMutateRevisionCase,
    onMutateRejectEntity,
    onMutateAssignWorkflow,
  } = useCaseActionsLogic({ workflowId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 space-y-2 bg-base-100 px-4 pt-4`}>
      <div className={`mb-8 flex flex-row space-x-3.5`}>
        <AssignDropdown
          assignedUser={assignedUser}
          avatarUrl={avatarUrl}
          assignees={assignees}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, id === authenticatedUser?.id);
          }}
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
                  'bg-violet-500/20 text-violet-500': tag === StateTag.COLLECTION_FLOW,
                })}
              >
                {toTitleCase(tagToBadgeData[tag].text)}
              </Badge>
            </div>
          )}
        </div>
        {showResolutionButtons && (
          <div className={`flex items-center space-x-4 self-start pe-[3.35rem]`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="md"
                  variant="warning"
                  disabled={isLoading || !canRevision}
                  className={ctw({ loading: debouncedIsLoadingRejectEntity })}
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
              size="md"
              variant="destructive"
              onClick={onMutateRejectEntity}
              disabled={isLoading || !canReject}
              className={ctw({
                loading: debouncedIsLoadingRejectEntity,
              })}
            >
              Reject
            </Button>
            <Button
              size="md"
              variant="success"
              onClick={onMutateApproveEntity}
              disabled={isLoading || !canApprove}
              className={ctw({
                loading: debouncedIsLoadingApproveEntity,
              })}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
