import { CogSvg, LogOutSvg } from 'components/atoms/icons';
import { useCallback, useState } from 'react';
import { ctw } from '../../../utils/ctw/ctw';
import { useSignOutMutation } from '../../../lib/react-query/mutations/useSignOutMutation/useSignOutMutation';
import { useAuthContext } from '../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import packageJson from '../../../../package.json';

export const BottomActions = () => {
  const [theme, setTheme] = useState(() => {
    const cachedTheme = localStorage.getItem(`theme`);

    if (!cachedTheme) return;

    return cachedTheme;
  });
  const onThemeChange = useCallback(
    (next: `dark` | `light`) => () => {
      localStorage.setItem(`theme`, next);
      document.documentElement.dataset.theme =
        next === `dark` ? `night` : `winter`;
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
    <div className={`mt-auto flex flex-col space-y-4`}>
      <div className="dropdown-hover dropdown-top dropdown">
        <button
          tabIndex={0}
          className={`btn-ghost btn-block btn mt-1 justify-start gap-x-2 focus:outline-primary`}
        >
          <CogSvg /> Settings
        </button>
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
      <span
        className={`label-text-alt self-end`}
      >{`v${packageJson.version}`}</span>
    </div>
  );
};
