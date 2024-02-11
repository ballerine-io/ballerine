import { ctw } from '@/common/utils/ctw/ctw';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import * as React from 'react';
import { PaginationLinkProps } from './types';
import { Link } from 'react-router-dom';

export const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  children,
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={ctw(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      {
        'pointer-events-none opacity-50': isActive,
      },
      className,
    )}
    {...props}
  >
    {children}
  </Link>
);
PaginationLink.displayName = 'PaginationLink';
