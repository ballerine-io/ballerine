import { INavItemProps } from './interfaces';
import { Link } from '@tanstack/react-router';
import { FunctionComponentWithChildren } from '../../../types';

/**
 * @description Wraps a {@link Link} @tanstack/react-router component with an li, accepts an optional icon, and handles the link's active state based on current route.
 *
 * @param children
 * @param icon - An optional icon to display to the left of the text, expects a format of "icon={<Icon/>}".
 * @param href - A string url to pass into the anchor's href attribute. Temporarily used for the link's isActive expression.
 *
 * @constructor
 */
export const NavItem: FunctionComponentWithChildren<INavItemProps> = ({
  children,
  icon,
  href,
}) => {
  return (
    <li>
      <Link
        to={href}
        activeProps={{
          className: `active`,
        }}
        className={`flex gap-x-2  rounded-md`}
        // Intentionally set to undefined explicitly.
        search={undefined}
        params={undefined}
      >
        {icon} {children}
      </Link>
    </li>
  );
};
