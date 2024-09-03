import * as React from 'react';
import { ComponentProps } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

export const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={ctw('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

Pagination.displayName = 'Pagination';
