import { Input } from '@app/components/atoms/Input';
import { headerNavigationLinks } from '@app/components/molecules/Header/header-navigation-links';
import { Navigation } from '@app/components/molecules/Navigation';
import { UserNavigation } from '@app/components/molecules/UserNavigation';

export const Header = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 flex-nowrap items-center justify-between px-4">
        <div className="flex flex-1 gap-4">
          <UserNavigation />
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
