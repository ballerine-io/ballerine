import * as React from 'react';
import DOMPurify from 'dompurify';

import { TNote } from './types';
import { TUsers } from '@/domains/users/types';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';

import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';

export const Note = ({ content, createdAt, user }: TNote & { user: TUsers[number] }) => {
  const prettyDate = useMemo(() => {
    const localDateTime = dayjs.utc(createdAt).local();

    const date = localDateTime.format('MMM DD, YYYY');
    const time = localDateTime.format('HH:mm');

    return `${date}, ${time}`;
  }, [createdAt]);

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <div
      className={`flex min-h-[80px] flex-col rounded-lg border-[1px] bg-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]`}
    >
      <div className={`flex items-center justify-between rounded-t-lg border-b bg-slate-100 p-2`}>
        <div className={`flex h-8 items-center space-x-2 text-sm font-medium`}>
          <UserAvatar
            className={`d-6`}
            avatarUrl={user.avatarUrl ?? undefined}
            fullName={fullName ?? ''}
          />
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span className={`max-w-[20ch] truncate`}>{fullName}</span>
              </TooltipTrigger>
              <TooltipContent>{fullName}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className={`text-xs`}>{prettyDate}</div>
      </div>
      <div className={`p-3 text-sm leading-6`}>
        <span
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content) as string,
          }}
        />
      </div>
    </div>
  );
};
