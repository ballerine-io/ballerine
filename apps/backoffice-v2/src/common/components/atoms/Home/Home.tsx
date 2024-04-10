import React, { FunctionComponent, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { UserAvatar } from '../UserAvatar/UserAvatar';

export const Home: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: session } = useAuthenticatedUserQuery();
  const user = useMemo(
    () => ({
      firstName: session?.user?.firstName,
      fullName: `${session?.user?.firstName} ${session?.user?.lastName}`,
      avatarUrl: session?.user?.avatarUrl,
    }),
    [session?.user?.firstName, session?.user?.lastName, session?.user?.avatarUrl],
  );

  return (
    <div className={`flex flex-col p-4`}>
      <div className={`mt-[27px] flex h-[36px] w-[441px] items-center`}>
        {user.avatarUrl && (
          <UserAvatar fullName={user.fullName} className={`mr-2 d-6`} avatarUrl={user.avatarUrl} />
        )}
        <h3 className={`flex text-2xl font-semibold`}>
          {t(`home.greeting`)}
          {user?.firstName && ` ${user.firstName}`}
        </h3>
      </div>
      <Outlet />
    </div>
  );
};
