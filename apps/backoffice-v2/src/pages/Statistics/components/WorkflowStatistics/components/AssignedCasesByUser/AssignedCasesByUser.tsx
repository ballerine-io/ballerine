import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

export const AssignedCasesByUser: FunctionComponent<{
  assignees: Array<{ name: string; value: number }>;
}> = ({ assignees }) => {
  return (
    <div className={'min-h-[12.375rem] rounded-xl bg-[#F6F6F6] p-2'}>
      <Card className={'flex h-full flex-col px-3'}>
        <CardHeader className={'pb-1'}>Assigned Cases by User</CardHeader>
        <CardContent>
          <ul className={'w-full max-w-sm'}>
            {assignees?.map(({ name, value }) => {
              return (
                <li key={name} className={'flex items-center justify-between space-x-4 text-xs'}>
                  <span className={'text-slate-500'}>{name}</span>
                  {value}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
