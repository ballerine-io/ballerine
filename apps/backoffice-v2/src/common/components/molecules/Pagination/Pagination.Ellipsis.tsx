import * as React from 'react';
import { ComponentProps } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

export const PaginationEllipsis = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={ctw('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

PaginationEllipsis.displayName = 'PaginationEllipsis';
