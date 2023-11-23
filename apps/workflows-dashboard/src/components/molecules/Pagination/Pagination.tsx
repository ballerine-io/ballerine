import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useCallback } from 'react';

interface Props {
  totalPages: number;
  page: number;
  onChange: (nextPage: number) => void;
}

export const Pagination = ({ totalPages, page, onChange }: Props) => {
  const changePage = useCallback(
    (nextPage: number) => {
      const isPageInRangeOfPages = nextPage <= totalPages || nextPage <= 1;

      if (!isPageInRangeOfPages) return;

      onChange(nextPage);
    },
    [onChange, totalPages],
  );

  const goToFirstPage = useCallback(() => {
    const FIRST_PAGE_NUMBER = 1;

    changePage(FIRST_PAGE_NUMBER);
  }, [changePage]);

  const goToPreviousPage = useCallback(() => {
    const PREV_PAGE_NUMBER = page - 1;

    changePage(PREV_PAGE_NUMBER);
  }, [page, changePage]);

  const goToLastPage = useCallback(() => {
    const LAST_PAGE_NUMBER = totalPages;

    changePage(LAST_PAGE_NUMBER);
  }, [totalPages, changePage]);

  const goToNextPage = useCallback(() => {
    const NEXT_PAGE_NUMBER = page + 1;

    changePage(NEXT_PAGE_NUMBER);
  }, [page, changePage]);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center text-sm">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={goToFirstPage}
            disabled={isFirstPage}
          >
            <span className="sr-only ">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToPreviousPage}
            disabled={isFirstPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToNextPage}
            disabled={isLastPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={goToLastPage}
            disabled={isLastPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
