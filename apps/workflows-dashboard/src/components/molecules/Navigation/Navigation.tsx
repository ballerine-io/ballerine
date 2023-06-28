import { memo } from 'react';
import { NavLink } from 'react-router-dom';

export interface NavigationLink {
  path: string;
  label: string;
}

interface Props {
  items: NavigationLink[];
}

export const Navigation = memo(({ items }: Props) => {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((navItem, index) => (
        <NavLink
          key={`nav-item-${index}`}
          className={({ isActive }) =>
            isActive
              ? 'hover:text-primary text-sm font-medium transition-colors'
              : 'text-muted-foreground hover:text-primary text-sm font-medium transition-colors'
          }
          to={navItem.path}
          children={navItem.label}
        />
      ))}
    </nav>
  );
});
