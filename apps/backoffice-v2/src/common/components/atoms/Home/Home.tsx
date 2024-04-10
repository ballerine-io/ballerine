import React, { FunctionComponent, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { UserAvatar } from '../UserAvatar/UserAvatar';

export const Home: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};

  return (
    <div className={`flex flex-col p-10`}>
      <div className={`flex items-center`}>
        {session?.user && (
          <UserAvatar fullName={fullName} className={`mr-2 d-6`} avatarUrl={avatarUrl} />
        )}
        <h3 className={`flex text-2xl font-semibold max-w-[45ch]`}>
          {t(`home.greeting`)}
          {session?.user && ` ${firstName}`}
        </h3>
      </div>
      <Outlet />
    </div>
  );
};
