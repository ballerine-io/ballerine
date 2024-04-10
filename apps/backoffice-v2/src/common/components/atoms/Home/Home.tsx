import React, { FunctionComponent, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { t } from 'i18next';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { UserAvatar } from '../UserAvatar/UserAvatar';

export const Home: FunctionComponent = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};

  return (
    <div className={`flex flex-col p-10`}>
      <div className={`flex items-center`}>
        {fullName && (
          <UserAvatar
            fullName={fullName}
            className={`mr-2 d-6`}
            avatarUrl={!avatarUrl ? undefined : avatarUrl}
          />
        )}
        <h3 className={`flex max-w-[45ch] text-2xl font-semibold`}>
          {t(`home.greeting`)}
          {firstName && ` ${firstName}`}
        </h3>
      </div>
      <Outlet />
    </div>
  );
};
