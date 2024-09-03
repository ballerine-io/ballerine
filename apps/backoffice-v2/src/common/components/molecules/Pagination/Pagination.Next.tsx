import * as React from 'react';
import { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { ChevronRightIcon } from '@radix-ui/react-icons';

import { PaginationLink } from '@/common/components/molecules/Pagination/Pagination.Link';
import { IPaginationWithIconProps } from '@/common/components/molecules/Pagination/interfaces';

export const PaginationNext: FunctionComponent<
  ComponentProps<typeof PaginationLink> & IPaginationWithIconProps
> = ({ className, iconOnly, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={ctw(
      'gap-1 pr-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span
      className={ctw({
        'sr-only': iconOnly,
      })}
    >
      Next
    </span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
);

PaginationNext.displayName = 'PaginationNext';
