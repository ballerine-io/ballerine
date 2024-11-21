import { FunctionComponent } from 'react';
import { Pagination } from '@/common/components/molecules/Pagination/Pagination';
import { PaginationContent } from '@/common/components/molecules/Pagination/Pagination.Content';
import { PaginationItem } from '@/common/components/molecules/Pagination/Pagination.Item';
import { PaginationFirst } from '@/common/components/molecules/Pagination/Pagination.First';
import { PaginationPrevious } from '@/common/components/molecules/Pagination/Pagination.Previous';
import { PaginationNext } from '@/common/components/molecules/Pagination/Pagination.Next';
import { PaginationLast } from '@/common/components/molecules/Pagination/Pagination.Last';

export const UrlPagination: FunctionComponent<{
  page: number;
  /**
   * Expects string search params to be returned.
   */
  onPrevPage: () => string;
  onNextPage: () => string;
  onLastPage: () => string;
  onPaginate: (page: number) => string;
  isLastPageEnabled?: boolean;
  isLastPage: boolean;
}> = ({
  page,
  onPrevPage,
  onNextPage,
  onLastPage,
  onPaginate,
  isLastPage,
  isLastPageEnabled = true,
}) => {
  return (
    <Pagination className={`justify-start`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            to={{
              search: onPaginate(1),
            }}
            iconOnly
            aria-disabled={page === 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            to={{
              search: onPrevPage(),
            }}
            iconOnly
            aria-disabled={page === 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            to={{
              search: onNextPage(),
            }}
            iconOnly
            aria-disabled={isLastPage}
          />
        </PaginationItem>
        {isLastPageEnabled && (
          <PaginationItem>
            <PaginationLast
              to={{
                search: onLastPage(),
              }}
              iconOnly
              aria-disabled={isLastPage}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
