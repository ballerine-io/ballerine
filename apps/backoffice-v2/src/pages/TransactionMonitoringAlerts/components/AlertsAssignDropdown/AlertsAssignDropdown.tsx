import React, { FunctionComponent, useMemo } from 'react';
import { TUsers } from '@/domains/users/types';
import { DoubleCaretSvg, UnassignedAvatarSvg } from '@/common/components/atoms/icons';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import { Dropdown } from '@/common/components/molecules/Dropdown/Dropdown';

export const AlertsAssignDropdown: FunctionComponent<{
  assignees: TUsers;
  authenticatedUserId: string;
  isDisabled: boolean;
  isAssignedToMe: boolean;
  onAssigneeSelect: (id: string | null, isAssignedToMe: boolean) => () => void;
}> = ({ assignees, authenticatedUserId, isDisabled, onAssigneeSelect }) => {
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

  const options = useMemo(() => {
    return [
      {
        id: 'unassign',
        value: null,
      },
      ...(sortedAssignees?.map(assignee => ({
        id: assignee?.id,
        value: assignee,
      })) ?? []),
    ];
  }, [sortedAssignees]);

  return (
    <Dropdown
      options={options}
      trigger={
        <>
          Assign
          <DoubleCaretSvg />
        </>
      }
      props={{
        trigger: {
          disabled: isDisabled,
          className:
            'flex min-w-[11.3ch] items-center justify-between gap-x-4 rounded-lg border border-neutral/10 px-4 py-1.5 text-sm disabled:opacity-50 dark:border-neutral/60',
        },
        content: {
          className: 'min-w-[14rem]',
          align: 'start',
        },
      }}
    >
      {({ item, DropdownItem }) => (
        <DropdownItem
          key={item?.id}
          className={'flex items-center gap-x-2'}
          onClick={onAssigneeSelect(
            item?.value === null ? null : item?.value?.id,
            item?.value?.id === authenticatedUserId,
          )}
        >
          {item?.value === null && (
            <>
              <UnassignedAvatarSvg className="d-[1.375rem]" />
              <span>Unassign</span>
            </>
          )}
          {item?.value !== null && (
            <>
              <UserAvatar avatarUrl={item?.value?.avatarUrl} fullName={item?.value?.fullName} />
              {`${item?.value?.fullName}${item?.value?.id === authenticatedUserId ? ' (You)' : ''}`}
            </>
          )}
        </DropdownItem>
      )}
    </Dropdown>
  );
};
