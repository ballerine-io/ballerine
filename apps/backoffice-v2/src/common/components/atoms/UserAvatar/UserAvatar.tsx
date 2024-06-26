import { Avatar } from '../Avatar';
import { createInitials } from '../../../utils/create-initials/create-initials';
import { ctw } from '../../../utils/ctw/ctw';
import React, { ComponentProps } from 'react';

interface IUserAvatarProps extends Omit<ComponentProps<typeof Avatar>, 'src' | 'alt'> {
  fullName: string;
  avatarUrl: string | undefined;
}

export const UserAvatar: React.FC<IUserAvatarProps> = ({
  avatarUrl,
  fullName,
  className,
  ...props
}) => {
  const name = fullName || 'Anonymous';

  return (
    <Avatar
      src={avatarUrl ?? ''}
      alt={`${name}'s avatar`}
      placeholder={!avatarUrl ? createInitials(name) : undefined}
      className={ctw(
        `bg-[#DCE1E8] text-[10px] font-semibold leading-3 text-black d-[1.375rem]`,
        className,
      )}
      {...props}
    />
  );
};
