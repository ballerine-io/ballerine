import * as React from 'react';
import { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

import { PaginationLink } from '@/common/components/molecules/Pagination/Pagination.Link';
import { ChevronLast } from 'lucide-react';
import { IPaginationWithIconProps } from '@/common/components/molecules/Pagination/interfaces';

export const PaginationLast: FunctionComponent<
  ComponentProps<typeof PaginationLink> & IPaginationWithIconProps
> = ({ className, iconOnly, ...props }) => (
  <PaginationLink
    aria-label="Go to last page"
    size="default"
    className={ctw('gap-1 pr-2.5', className)}
    {...props}
  >
    <span
      className={ctw({
        'sr-only': iconOnly,
      })}
    >
      Last
    </span>
    <ChevronLast className="h-4 w-4" />
  </PaginationLink>
);

PaginationLast.displayName = 'PaginationLast';
