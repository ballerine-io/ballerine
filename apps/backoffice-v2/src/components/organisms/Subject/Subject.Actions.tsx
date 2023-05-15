import React, { FunctionComponent } from 'react';
import { Avatar } from 'components/atoms/Avatar';
import { IActionsProps } from 'components/organisms/Subject/interfaces';
import {
  ResubmissionReason,
  useActions,
} from 'components/organisms/Subject/hooks/useActions/useActions';
import { motion } from 'framer-motion';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ctw } from '../../../utils/ctw/ctw';
import { DropdownMenu } from 'components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from 'components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from 'components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuSeparator } from 'components/molecules/DropdownMenu/DropdownMenu.Separator';
import { DropdownMenuLabel } from 'components/molecules/DropdownMenu/DropdownMenu.Label';
import { DropdownMenuItem } from 'components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuShortcut } from 'components/molecules/DropdownMenu/DropDownMenu.Shortcut';
import { Action } from '../../../enums';
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
import AssignButton from "components/atoms/AssignButton/AssignButton";
import {
  useGetSessionQuery
} from "../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery";

/**
 * @description To be used by {@link Subject}. Displays the end user's full name, avatar, and handles the reject/approve mutation.
 *
 * @param props
 * @param props.id - The id of the end user, passed into the reject/approve mutation.
 * @param props.fullName - The full name of the end user.
 * @param props.avatarUrl - The end user's image url to pass into {@link Avatar}.
 *
 * @see {@link Subject}
 * @see {@link Avatar}
 *
 * @constructor
 */
export const Actions: FunctionComponent<IActionsProps> = ({ id, fullName, avatarUrl }) => {
  const {
    onMutateApproveEndUser,
    onMutateRejectEndUser,
    debouncedIsLoadingApproveEndUser,
    debouncedIsLoadingRejectEndUser,
    isLoading,
    isLoadingEndUser,
    initials,
    canApprove,
    canReject,
    documentToResubmit,
    onDocumentToResubmitChange,
    resubmissionReason,
    onResubmissionReasonChange,
    caseState,
    authenticatedUser
  } = useActions({ endUserId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 bg-base-100 px-4 pt-2`}>
      <AssignButton
        assignees={[{id: 1, name: 'Omri', isCaseAssignedToMe: false}, {id: 2, name: 'ME', isCaseAssignedToMe: false}]}
        authenticatedUser={authenticatedUser}
        caseState={caseState}
        onAssigneeSelect={(id) => {console.log(String(id))}}
      />
      <div className={`flex h-[7.75rem] justify-between`}>
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
            className={ctw(`text-2xl`, {
              'h-8 w-[24ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                isLoadingEndUser,
            })}
          >
            {fullName}
          </h2>
        </motion.div>
        <div className={`flex items-center space-x-6`}>
          <button
            className={ctw(
              `btn-info btn justify-center before:mr-2 before:border-2 before:border-transparent before:content-[''] before:d-4 after:ml-2 after:border-2 after:border-transparent after:content-[''] after:d-4`,
              {
                loading: debouncedIsLoadingRejectEndUser,
              },
            )}
            // disabled={isLoading || !canReject}
            disabled
          >
            Execute Tasks
          </button>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={ctw(
                    `btn-error btn justify-center before:mr-2 before:border-2 before:border-transparent before:content-[''] before:d-4 after:ml-2 after:border-2 after:border-transparent after:content-[''] after:d-4`,
                    {
                      loading: debouncedIsLoadingRejectEndUser,
                    },
                  )}
                  disabled={isLoading || !canReject}
                >
                  Reject
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`min-w-[16rem]`} align={`end`}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={`cursor-pointer`}
                  onClick={onMutateRejectEndUser({
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
                        disabled={reason !== ResubmissionReason.BLURRY_IMAGE}
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
                    onClick={onMutateRejectEndUser({
                      action: Action.RESUBMIT,
                      // Currently hardcoded to documentOne.
                      documentToResubmit,
                      resubmissionReason,
                    })}
                    disabled={!resubmissionReason}
                  >
                    Confirm
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <HoverCard.Root openDelay={0} closeDelay={0}>
            <HoverCard.Trigger asChild>
              <button
                className={ctw(
                  `btn-success btn justify-center before:mr-2 before:border-2 before:border-transparent before:content-[''] before:d-4 after:ml-2 after:border-2 after:border-transparent after:content-[''] after:d-4`,
                  {
                    loading: debouncedIsLoadingApproveEndUser,
                  },
                )}
                disabled={isLoading || !canApprove}
                onClick={onMutateApproveEndUser}
              >
                Approve
              </button>
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
