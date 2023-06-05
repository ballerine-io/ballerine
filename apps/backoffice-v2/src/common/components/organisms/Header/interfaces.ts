import { NavLinkProps } from 'react-router-dom';

export type TNavItemProps = Omit<NavLinkProps, 'to'> & {
  href: string;
  icon?: JSX.Element;
  className?: string;
};
