import * as React from 'react';
import { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

import { PaginationLink } from '@/common/components/molecules/Pagination/Pagination.Link';
import { ChevronFirst } from 'lucide-react';
import { IPaginationWithIconProps } from '@/common/components/molecules/Pagination/interfaces';

export const PaginationFirst: FunctionComponent<
  ComponentProps<typeof PaginationLink> & IPaginationWithIconProps
> = ({ className, iconOnly, ...props }) => (
  <PaginationLink
    aria-label="Go to first page"
    size="default"
    className={ctw('gap-1 pr-2.5', className)}
    {...props}
  >
    <ChevronFirst className="h-4 w-4" />
    <span
      className={ctw({
        'sr-only': iconOnly,
      })}
    >
      First
    </span>
  </PaginationLink>
);
PaginationFirst.displayName = 'PaginationFirst';
