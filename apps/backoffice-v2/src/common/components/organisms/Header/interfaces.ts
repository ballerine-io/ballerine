import { LinkPropsOptions } from '@tanstack/react-router';

export type TNavItemProps = LinkPropsOptions & {
  href: string;
  icon?: JSX.Element;
  className?: string;
};
