import { FunctionComponent } from 'react';
import { Avatar } from 'components/atoms/Avatar';
import { IActionsProps } from 'components/organisms/Subject/interfaces';
import { EllipsisButton } from 'components/atoms/EllipsisButton/EllipsisButton';
import { useActions } from 'components/organisms/Subject/hooks/useActions/useActions';
import { motion } from 'framer-motion';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ctw } from '../../../utils/ctw/ctw';

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
  } = useActions({ endUserId: id, fullName });

  return (
    <div className={`sticky top-0 z-50 col-span-2 bg-base-100 px-4`}>
      <div className={`flex h-[7.75rem] justify-between pl-10`}>
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
          <Avatar
            src={avatarUrl}
            placeholder={!avatarUrl ? initials : undefined}
            alt={`${fullName}'s profile`}
            className={`h-16 w-16`}
            isLoading={isLoadingEndUser}
          />
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
          <HoverCard.Root openDelay={0} closeDelay={0}>
            <HoverCard.Trigger asChild>
              <button
                className={ctw(
                  `btn-error btn justify-center before:mr-2 before:border-2 before:border-transparent before:content-[''] before:d-4 after:ml-2 after:border-2 after:border-transparent after:content-[''] after:d-4`,
                  {
                    loading: debouncedIsLoadingRejectEndUser,
                  },
                )}
                disabled={isLoading || !canReject}
                onClick={onMutateRejectEndUser}
              >
                Reject
              </button>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content
                className={`card card-compact mt-2 rounded-md border-neutral/10 bg-base-100 p-2 shadow theme-dark:border-neutral/50`}
              >
                <div className={`flex items-center space-x-2`}>
                  <kbd className="kbd">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="kbd">J</kbd>
                </div>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
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
          <div className="dropdown-hover dropdown-bottom dropdown-end dropdown">
            <EllipsisButton tabIndex={0} />
            <ul
              className={`dropdown-content menu h-72 w-48 space-y-2 rounded-md border border-neutral/10 bg-base-100 p-2 theme-dark:border-neutral/60`}
            >
              <li className={`disabled`}>
                <button disabled>Coming Soon</button>
              </li>
              <li className={`disabled`}>
                <button disabled>Coming Soon</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={`divider my-0 w-full`}></div>
    </div>
  );
};
