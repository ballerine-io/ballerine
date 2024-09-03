import * as React from 'react';
import { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

import { PaginationLink } from '@/common/components/molecules/Pagination/Pagination.Link';
import { IPaginationWithIconProps } from '@/common/components/molecules/Pagination/interfaces';

export const PaginationPrevious: FunctionComponent<
  ComponentProps<typeof PaginationLink> & IPaginationWithIconProps
> = ({ className, iconOnly, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={ctw(
      'gap-1 pl-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span
      className={ctw({
        'sr-only': iconOnly,
      })}
    >
      Previous
    </span>
  </PaginationLink>
);

PaginationPrevious.displayName = 'PaginationPrevious';
