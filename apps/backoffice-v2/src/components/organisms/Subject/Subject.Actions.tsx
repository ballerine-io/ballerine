import React, { FunctionComponent } from 'react';
import { Avatar } from 'components/atoms/Avatar';
import { IActionsProps } from 'components/organisms/Subject/interfaces';
import { useActions } from 'components/organisms/Subject/hooks/useActions/useActions';
import { motion } from 'framer-motion';
import { ctw } from '../../../utils/ctw/ctw';
import { Button } from 'components/atoms/Button/button';

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
  } = useActions({ endUserId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 bg-base-100 px-4 pt-2`}>
      <div className={`space-x-4`}>
        <Button variant={'outline'} disabled>
          Un-assign
        </Button>
        <Button variant={'outline'}>Re-assign</Button>
      </div>
      <div className={`flex h-24 justify-between`}>
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
      </div>
    </div>
  );
};
