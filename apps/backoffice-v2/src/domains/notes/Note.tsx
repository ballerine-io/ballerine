import dayjs from 'dayjs';
import * as React from 'react';
import { useMemo } from 'react';
import DOMPurify from 'dompurify';

import { TNote } from './types';
import { TUsers } from '@/domains/users/types';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';

export const Note = ({
  content,
  createdAt,
  user,
}: TNote & { user: TUsers[number] | undefined }) => {
  const formattedDate = useMemo(
    () => dayjs.utc(createdAt).local().format('MMM DD, YYYY, HH:mm'),
    [createdAt],
  );

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <div
      className={`flex min-h-[80px] flex-col rounded-lg border-[1px] bg-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]`}
    >
      <div
        className={`flex max-h-[40px] items-center justify-between rounded-t-lg border-b bg-slate-100 p-2`}
      >
        <div className={`flex h-8 items-center space-x-2 text-sm font-medium`}>
          <UserAvatar
            className={`d-6`}
            avatarUrl={user?.avatarUrl ?? undefined}
            fullName={fullName ?? ''}
          />
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span className={`max-w-[20ch] truncate`}>{fullName}</span>
            </TooltipTrigger>
            <TooltipContent>{fullName}</TooltipContent>
          </Tooltip>
        </div>
        <div className={`text-xs`}>{formattedDate}</div>
      </div>
      <div
        className={`p-3 text-sm leading-6`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content, { ADD_ATTR: ['target'] }) as string,
        }}
      />
    </div>
  );
};
