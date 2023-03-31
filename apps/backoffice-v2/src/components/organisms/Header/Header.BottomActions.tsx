import { useCallback, useState } from 'react';
import { ctw } from '@/utils/ctw/ctw';
import { useSignOutMutation } from '@/lib/react-query/mutations/useSignOutMutation/useSignOutMutation';
import { useAuthContext } from '@/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import packageJson from '../../../../package.json';
import { Button } from '@/components/atoms/Button';
import { Cog, LogOut } from 'lucide-react';

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
    <div className={`mt-auto flex flex-col space-y-4`}>
      <div className="dropdown-hover dropdown-top dropdown">
        <Button tabIndex={0} variant={'ghost'} className={`justify-start`} fullWidth>
          <Cog className={`me-2`} /> Settings
        </Button>
        <ul
          className={`dropdown-content menu h-72 w-48 space-y-2 rounded-md border border-neutral/10 p-2 text-base-content shadow theme-dark:border-neutral/60`}
        >
          <li className="menu-title">
            <span>Theme</span>
          </li>
          <li>
            <Button
              variant={`ghost`}
              className={ctw({
                'bg-primary text-base-100': theme === `dark`,
              })}
              onClick={onThemeChange(`dark`)}
            >
              Dark
            </Button>
          </li>
          <li>
            <Button
              variant={`ghost`}
              className={ctw({
                'bg-primary text-base-100': theme === `light`,
              })}
              onClick={onThemeChange(`light`)}
            >
              Light
            </Button>
          </li>
        </ul>
      </div>
      <Button variant={'ghost'} className={`justify-start`} onClick={onSignOut} fullWidth>
        <LogOut className={`me-2`} /> Log out
      </Button>
      <span className={`label-text-alt self-end`}>{`v${packageJson.version}`}</span>
    </div>
  );
};
