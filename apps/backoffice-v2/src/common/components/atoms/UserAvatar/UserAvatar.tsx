import { Avatar } from '../Avatar';
import { createInitials } from '../../../utils/create-initials/create-initials';
import { ctw } from '../../../utils/ctw/ctw';
import React from 'react';

interface IUserAvatarProps {
  fullName: string;
  avatarUrl?: string;
  className?: string;
}

export const UserAvatar: React.FC<IUserAvatarProps> = ({ avatarUrl, fullName, className }) => (
  <Avatar
    src={avatarUrl}
    alt={`${fullName}'s avatar`}
    placeholder={!avatarUrl ? createInitials(fullName) : undefined}
    className={ctw(
      `bg-[#DCE1E8] text-[10px] font-semibold leading-3 text-black d-[22px] ${className}`,
    )}
  />
);
