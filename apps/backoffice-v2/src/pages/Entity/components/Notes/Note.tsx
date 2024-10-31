import * as React from 'react';

import { TNote } from './types';
import { TUsers } from '@/domains/users/types';

export const Note = ({ content, createdAt, createdBy, user }: TNote & { user: TUsers[number] }) => {
  return (
    <div
      className={`min-h-[100px] rounded bg-white p-4`}
    >{`${user.firstName} ${user.lastName}`}</div>
  );
};
