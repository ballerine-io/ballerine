import React, { FunctionComponent } from 'react';
import { Avatar } from 'components/atoms/Avatar';
import { IActionsProps } from './interfaces';
import { ResubmissionReason, useActions } from './hooks/useActions/useActions';
import { motion } from 'framer-motion';
import { ctw } from '../../../../utils/ctw/ctw';
import { DropdownMenu } from 'components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from 'components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from 'components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuSeparator } from 'components/molecules/DropdownMenu/DropdownMenu.Separator';
import { DropdownMenuLabel } from 'components/molecules/DropdownMenu/DropdownMenu.Label';
import { DropdownMenuItem } from 'components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuShortcut } from 'components/molecules/DropdownMenu/DropDownMenu.Shortcut';
import { Action } from '../../../../enums';
import { Dialog } from 'components/organisms/Dialog/Dialog';
import { DialogFooter } from 'components/organisms/Dialog/Dialog.Footer';
import { DialogContent } from 'components/organisms/Dialog/Dialog.Content';
import { DialogTrigger } from 'components/organisms/Dialog/Dialog.Trigger';
import { DialogTitle } from 'components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from 'components/organisms/Dialog/Dialog.Description';
import { DialogHeader } from 'components/organisms/Dialog/Dialog.Header';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/atoms/Select/Select';
import { AssignButton, Assignee } from 'components/atoms/AssignButton/AssignButton';
import * as HoverCard from '@radix-ui/react-hover-card';
import { Button } from 'components/atoms/Button/button';

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
export const Actions: FunctionComponent<IActionsProps> = ({ id, fullName, avatarUrl }) => {
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
  } = useActions({ entityId: id, fullName });

  const actionButtonDisabled = !caseState.actionButtonsEnabled;
  const isAssignedToMe = true;

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
            onMutateAssignWorkflow(id, isAssignedToMe);
          }}
          buttonType={'Assign'}
        />
        <AssignButton
          assignees={assignees as Assignee[]}
          authenticatedUser={authenticatedUser}
          caseState={caseState}
          onAssigneeSelect={id => {
            onMutateAssignWorkflow(id, !isAssignedToMe);
          }}
          buttonType={'Re-Assign'}
        />
      </div>
      <div className={`flex h-20 justify-between`}>
        <motion.div
          // Animate when the user changes.
          key={id}
          className={`flex items-center space-x-8`}
          initial={{
            opacity: 0,
            x: '-50px',
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className={ctw(`text-2xl font-bold`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingEntity,
            })}
          >
            {fullName}
          </h2>
        </motion.div>
        <div className={`flex items-center space-x-6`}>
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
                  This action will send a request to the user to re-submit their document. State the
                  reason for requesting a document re-submission.
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={onResubmissionReasonChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Re-submission reason" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ResubmissionReason).map(reason => {
                    const reasonWithSpaceSpace = reason.replace(/_/g, ' ').toLowerCase();
                    const capitalizedReason =
                      reasonWithSpaceSpace.charAt(0).toUpperCase() + reasonWithSpaceSpace.slice(1);

                    return (
                      <SelectItem
                        key={reason}
                        value={reason}
                        disabled={
                          actionButtonDisabled && reason !== ResubmissionReason.BLURRY_IMAGE
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
                    disabled={actionButtonDisabled && !resubmissionReason}
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
      </div>
    </div>
  );
};
