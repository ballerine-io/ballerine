import { useLogoutMutation } from '@app/common/hooks/useLogoutMutation';
import { Input } from '@app/components/atoms/Input';
import { Navigation } from '@app/components/molecules/Navigation';
import { UserNavigation } from '@app/components/molecules/UserNavigation';
import { headerNavigationLinks } from './header-navigation-links';

export const Header = () => {
  const { logout } = useLogoutMutation();

  return (
    <div className="border-b">
      <div className="flex h-16 flex-nowrap items-center justify-between px-4">
        <div className="flex flex-1 gap-4">
          <UserNavigation onLogout={logout} />
          <Navigation items={headerNavigationLinks} />
        </div>
        <div className="flex gap-4">
          <div>
            <Input placeholder="Search" />
          </div>
        </div>
      </div>
    </div>
  );
};
