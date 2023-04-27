import { LogOutSvg } from 'components/atoms/icons';
import React, { useCallback, useState } from 'react';
import { ctw } from '../../../utils/ctw/ctw';
import { useSignOutMutation } from '../../../lib/react-query/mutations/useSignOutMutation/useSignOutMutation';
import { useAuthContext } from '../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import packageJson from '../../../../package.json';
import { Avatar } from 'components/atoms/Avatar';

export const BottomActions = () => {
  const [theme, setTheme] = useState(() => {
    const cachedTheme = localStorage.getItem(`theme`);

    if (!cachedTheme) return;

    return cachedTheme;
  });
  const onThemeChange = useCallback(
    (next: `dark` | `light`) => () => {
      localStorage.setItem(`theme`, next);
      document.documentElement.dataset.theme = next === `dark` ? `night` : `winter`;
      setTheme(next);
    },
    [],
  );
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

  return (
    <div className={`mt-auto flex flex-col space-y-2`}>
      <div>
        <Avatar
          // src={avatarUrl}
          src={''}
          // placeholder={!avatarUrl ? initials : undefined}
          placeholder={'O'}
          alt={`${''}'s profile`}
          className={`ml-4 mr-2 d-6`}
          isLoading={false}
        />
        {'Operator'}
      </div>
      <div className="dropdown-hover dropdown-top dropdown">
        <ul
          className={`dropdown-content menu h-72 w-48 space-y-2 rounded-md border border-neutral/10 p-2 text-base-content shadow theme-dark:border-neutral/60`}
        >
          <li className="menu-title">
            <span>Theme</span>
          </li>
          <li>
            <button
              className={ctw({
                active: theme === `dark`,
              })}
              onClick={onThemeChange(`dark`)}
            >
              Dark
            </button>
          </li>
          <li>
            <button
              className={ctw({
                active: theme === `light`,
              })}
              onClick={onThemeChange(`light`)}
            >
              Light
            </button>
          </li>
        </ul>
      </div>
      <button
        className={`btn-ghost btn-block btn justify-start gap-x-2 focus:outline-primary`}
        onClick={onSignOut}
      >
        <LogOutSvg /> Log out
      </button>
      <span className={`label-text-alt self-end`}>{`v${packageJson.version}`}</span>
    </div>
  );
};
