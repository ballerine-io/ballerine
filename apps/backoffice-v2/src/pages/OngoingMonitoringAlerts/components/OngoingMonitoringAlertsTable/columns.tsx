import { AvatarFallback } from '@/common/components/atoms/Avatar_/Avatar.Fallback';
import { AvatarImage } from '@/common/components/atoms/Avatar_/Avatar.Image';
import { Avatar } from '@/common/components/atoms/Avatar_/Avatar_';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { UserCircle2 } from 'lucide-react';
import { titleCase } from 'string-ts';

const columnHelper = createColumnHelper<any>();

export const columns = [
  columnHelper.accessor('dataTimestamp', {
    cell: info => {
      const dataTimestamp = info.getValue();

      if (!dataTimestamp) {
        return <TextWithNAFallback>{dataTimestamp}</TextWithNAFallback>;
      }

      const date = dayjs(dataTimestamp).format('MMM DD, YYYY');
      const time = dayjs(dataTimestamp).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('websiteUrl', {
    cell: info => {
      return <span className={`font-semibold`}>{info.getValue<string>()}</span>;
    },
    header: 'User',
  }),
  columnHelper.accessor('risks', {
    cell: info => {
      return <span>{info.getValue()}</span>;
    },
    header: 'Risks',
  }),
  columnHelper.accessor('lastScore', {
    cell: info => {
      return <TextWithNAFallback>{info.getValue()}</TextWithNAFallback>;
    },
    header: 'Last Score',
  }),
  columnHelper.accessor('previousScore', {
    cell: info => {
      return <TextWithNAFallback>{info.getValue()}</TextWithNAFallback>;
    },
    header: 'Previous Score',
  }),
  columnHelper.accessor('assignee', {
    cell: info => {
      const assignee = info.getValue();

      return (
        <div className={`flex items-center gap-x-3`}>
          {!assignee && <UserCircle2 className={'stroke-[#E4E4E7]'} size={22} />}
          {assignee && (
            <Avatar className={`d-[1.375rem]`}>
              <AvatarImage src={assignee?.avatarUrl} />
              <AvatarFallback className={'bg-[#DCE1E8] text-xs'}>
                {createInitials(assignee?.fullName)}
              </AvatarFallback>
            </Avatar>
          )}
          <TextWithNAFallback>{assignee?.fullName}</TextWithNAFallback>
        </div>
      );
    },
    header: 'Assignee',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue();

      return (
        <TextWithNAFallback className={`font-semibold`}>{titleCase(status)}</TextWithNAFallback>
      );
    },
    header: 'Status',
  }),
];
