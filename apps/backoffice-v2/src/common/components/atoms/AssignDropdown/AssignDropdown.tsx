import React, { useMemo } from 'react';

import { CheckSvg, DoubleCaretSvg, UnassignedAvatarSvg } from '../icons';
import { DropdownMenu } from '../../molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuItem } from '../../molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from '../../molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from '../../molecules/DropdownMenu/DropdownMenu.Content';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { TAuthenticatedUser } from '../../../../domains/auth/types';

export type Assignee = Pick<TAuthenticatedUser, 'id' | 'fullName' | 'avatarUrl'>;

interface IAssignDropdownProps {
  assignees: Assignee[];
  assignedUser?: Assignee;
  authenticatedUserId: string;
  onAssigneeSelect: (id: string) => void;
}

export const AssignDropdown: React.FC<IAssignDropdownProps> = ({
  assignedUser,
  assignees,
  onAssigneeSelect,
  authenticatedUserId,
}) => {
  const sortedAssignees = useMemo(
    () =>
      // Sort assignees so that the authenticated user is always first
      assignees
        ?.slice()
        ?.sort((a, b) =>
          a?.id === authenticatedUserId ? -1 : b?.id === authenticatedUserId ? 1 : 0,
        ),
    [assignees, authenticatedUserId],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="form-control flex w-[200px] cursor-pointer rounded-lg border border-neutral/10 px-4 py-[6px] text-sm theme-dark:border-neutral/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {assignedUser?.fullName ? (
                <UserAvatar avatarUrl={assignedUser?.avatarUrl} fullName={assignedUser?.fullName} />
              ) : (
                <UnassignedAvatarSvg className="d-[22px]" />
              )}
              <span className="ml-2 bg-transparent text-sm">
                {assignedUser?.fullName ?? 'Unassigned'}
              </span>
            </div>
            <DoubleCaretSvg />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[14rem]" align="start">
        {Array.isArray(sortedAssignees) &&
          sortedAssignees.map(assignee => (
            <DropdownMenuItem
              key={assignee?.id}
              onClick={() =>
                onAssigneeSelect(assignedUser?.id !== assignee?.id ? assignee?.id : null)
              }
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <UserAvatar avatarUrl={assignee?.avatarUrl} fullName={assignee?.fullName} />
                  <span className="pl-2">
                    {`${assignee?.fullName}${assignee?.id === authenticatedUserId ? ' (You)' : ''}`}
                  </span>
                </div>
                {assignedUser?.id === assignee?.id && <CheckSvg className="d-4" />}
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
