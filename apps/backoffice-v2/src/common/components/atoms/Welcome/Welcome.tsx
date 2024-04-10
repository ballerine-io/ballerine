import React, { FunctionComponent, useMemo } from 'react';
import { t } from 'i18next';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { UserAvatar } from '../../atoms/UserAvatar/UserAvatar';

export const Welcome: FunctionComponent = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const user = useMemo(
    () => ({
      firstname: session?.user?.firstName,
      fullname: `${session?.user?.firstName} ${session?.user?.lastName}`,
      avatarUrl: session?.user?.avatarUrl,
    }),
    [session?.user?.firstName, session?.user?.lastName, session?.user?.avatarUrl],
  );
  return (
    <div className={`mt-[27px] flex h-[36px] w-[441px] items-center`}>
      {user.avatarUrl && <UserAvatar fullName={user.fullname} className={`mr-2 d-6`} avatarUrl={user.avatarUrl} />}
      <div className={`flex gap-x-2 text-[24px] font-semibold leading-[36px]`}>
        <span>{t('welcome.greeting', { defaultValue: 'Welcome' })}</span>
        {user.firstname && <span>{user.firstname}</span>}
      </div>
    </div>
  );
};