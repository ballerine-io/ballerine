import { TNavItemProps } from './interfaces';
import { NavLink } from 'react-router-dom';
import { FunctionComponentWithChildren } from '../../../types';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description Wraps a {@link Link} react-router-dom component with an li, accepts an optional icon, and handles the link's active state based on current route.
 *
 * @param children
 * @param icon - An optional icon to display to the left of the text, expects a format of "icon={<Icon/>}".
 * @param href - A string url to pass into the anchor's href attribute. Temporarily used for the link's isActive expression.
 *
 * @constructor
 */
export const NavItem: FunctionComponentWithChildren<TNavItemProps> = ({
  children,
  icon,
  href,
  className,
  ...props
}) => {
  return (
    <li>
      <NavLink
        to={href}
        {...props}
        className={({ isActive }) =>
          ctw(
            `flex gap-x-2 rounded-md`,
            {
              'font-bold': isActive,
            },
            className,
          )
        }
      >
        {icon} {children}
      </NavLink>
    </li>
  );
};
