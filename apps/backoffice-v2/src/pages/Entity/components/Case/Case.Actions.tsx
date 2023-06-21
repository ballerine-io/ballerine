import React, { FunctionComponent } from 'react';
import { Avatar } from '../../../../common/components/atoms/Avatar';
import { IActionsProps } from './interfaces';
import { ResubmissionReason, useActions } from './hooks/useActions/useActions';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DropdownMenu } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuSeparator } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Separator';
import { DropdownMenuLabel } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Label';
import { DropdownMenuItem } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuShortcut } from '../../../../common/components/molecules/DropdownMenu/DropDownMenu.Shortcut';
import { Action } from '../../../../common/enums';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogClose } from '@radix-ui/react-dialog';
import { Select } from '../../../../common/components/atoms/Select/Select';
import {
  AssignButton,
  Assignee,
} from '../../../../common/components/atoms/AssignButton/AssignButton';
import * as HoverCard from '@radix-ui/react-hover-card';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';

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
    onMutateRejectEntity,
    onMutateAssignWorkflow,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingAssignEntity,
    isLoading,
    isLoadingEntity,
    initials,
    canApprove,
    canReject,
    documentToResubmit,
    onDocumentToResubmitChange,
    resubmissionReason,
    onResubmissionReasonChange,
    caseState,
    authenticatedUser,
    assignees,
    isActionButtonDisabled,
    onTriggerAssignToMe,
    isAssignedToMe,
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
        />
        <AssignButton
          assignees={assignees as Assignee[]}
          authenticatedUser={authenticatedUser}
          caseState={caseState}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, !onTriggerAssignToMe);
          }}
          buttonType={'Re-Assign'}
        />
      </div>
      <div className={`flex h-20 justify-between`}>
        <div className={`flex items-center space-x-8`}>
          <h2
            className={ctw(`text-2xl font-bold`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingEntity,
            })}
          >
            {fullName}
          </h2>
        </div>
        {showResolutionButtons && (
          <div className={`pe-[3.35rem] flex items-center space-x-6`}>
            <Button
              className={ctw({
                // loading: debouncedIsLoadingRejectEntity,
              })}
              // disabled={actionButtonDisabled}
              disabled
            >
              Execute Tasks
            </Button>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={`destructive`}
                    className={ctw({
                      // loading: debouncedIsLoadingRejectEntity,
                    })}
                    // disabled={isLoading || !canReject}
                    disabled
                  >
                    Reject
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`min-w-[16rem]`} align={`end`}>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={`cursor-pointer`}
                    onClick={onMutateRejectEntity({
                      action: Action.REJECT,
                    })}
                  >
                    Reject
                    <DropdownMenuShortcut>Ctrl + J</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem className={`cursor-pointer`}>
                      Re-submit Document
                      <DropdownMenuShortcut>Ctrl + R</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request document re-submission</DialogTitle>
                  <DialogDescription>
                    This action will send a request to the user to re-submit their document. State
                    the reason for requesting a document re-submission.
                  </DialogDescription>
                </DialogHeader>
                <Select onValueChange={onResubmissionReasonChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Re-submission reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ResubmissionReason).map(reason => {
                      const reasonWithSpace = reason.replace(/_/g, ' ').toLowerCase();
                      const capitalizedReason =
                        reasonWithSpace.charAt(0).toUpperCase() + reasonWithSpace.slice(1);

                      return (
                        <SelectItem
                          key={reason}
                          value={reason}
                          disabled={
                            isActionButtonDisabled && reason !== ResubmissionReason.BLURRY_IMAGE
                          }
                        >
                          {capitalizedReason}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <DialogClose asChild>
                    <button
                      className={ctw(`btn-error btn justify-center`)}
                      onClick={onMutateRejectEntity({
                        action: Action.RESUBMIT,
                        // Currently hardcoded to documentOne.
                        documentToResubmit,
                        resubmissionReason,
                      })}
                      disabled={isActionButtonDisabled && !resubmissionReason}
                    >
                      Confirm
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <HoverCard.Root openDelay={0} closeDelay={0}>
              <HoverCard.Trigger asChild>
                <Button
                  className={ctw({
                    // loading: debouncedIsLoadingApproveEntity,
                  })}
                  variant={`success`}
                  // disabled={isLoading || !canApprove}
                  onClick={onMutateApproveEntity}
                  disabled
                >
                  Approve
                </Button>
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content
                  className={`card card-compact mt-2 rounded-md border-neutral/10 bg-base-100 p-2 shadow theme-dark:border-neutral/50`}
                >
                  <div className={`flex items-center space-x-2`}>
                    <kbd className="kbd">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="kbd">A</kbd>
                  </div>
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
            {/*<div className="dropdown-hover dropdown dropdown-bottom dropdown-end">*/}
            {/*  <EllipsisButton tabIndex={0} />*/}
            {/*  <ul*/}
            {/*    className={`dropdown-content menu h-72 w-48 space-y-2 rounded-md border border-neutral/10 bg-base-100 p-2 theme-dark:border-neutral/60`}*/}
            {/*  >*/}
            {/*    <li className={`disabled`}>*/}
            {/*      <button disabled>Coming Soon</button>*/}
            {/*    </li>*/}
            {/*    <li className={`disabled`}>*/}
            {/*      <button disabled>Coming Soon</button>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
          </div>
        )}
      </div>
    </div>
  );
};
