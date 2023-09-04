import { LogOutSvg } from '../../atoms/icons';
import React, { useCallback, useMemo, useState } from 'react';
import { useSignOutMutation } from '../../../../domains/auth/hooks/mutations/useSignOutMutation/useSignOutMutation';
import { useAuthContext } from '../../../../domains/auth/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { Avatar } from '../../atoms/Avatar';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const BottomActions = () => {
  const { mutate: signOut } = useSignOutMutation();
  const { signOutOptions } = useAuthContext();
  const onSignOut = useCallback(
    () =>
      signOut({
        redirect: signOutOptions?.redirect,
        callbackUrl: signOutOptions?.callbackUrl,
      }),
    [signOutOptions?.redirect, signOutOptions?.callbackUrl, signOut],
  );
  const { data: session } = useAuthenticatedUserQuery();
  const fullName = useMemo(
    () => `${session?.user?.firstName} ${session?.user?.lastName}`,
    [session?.user?.firstName, session?.user?.lastName],
  );

  return (
    <div className={`mt-auto flex flex-col space-y-2 px-4`}>
      <div>
        <Avatar
          src={''}
          placeholder={'O'}
          alt={`${fullName}'s profile`}
          className={`mr-2 d-6`}
          isLoading={false}
        />
        {fullName}
      </div>
      <button
        className={`btn btn-ghost btn-block ml-1 justify-start gap-x-2 px-0 text-sm font-medium normal-case hover:bg-transparent focus:outline-primary`}
        onClick={onSignOut}
      >
        <LogOutSvg className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
};
