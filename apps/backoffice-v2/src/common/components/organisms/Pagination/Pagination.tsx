import { FunctionComponent } from 'react';
import { IPaginationProps } from './interfaces';
import { Button } from '../../atoms/Button/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination: FunctionComponent<IPaginationProps> = ({
  onPaginate,
  page,
  totalPages,
}) => {
  return (
    <div className={`mt-3 flex items-center space-x-2 px-1`}>
      <span className={`w-full text-sm font-bold`}>
        Page {page} of {totalPages}
      </span>
      <nav className={`flex justify-center space-x-2`}>
        <Button
          className={`px-2`}
          size={`sm`}
          variant={`outline`}
          onClick={onPaginate(1)}
          disabled={page === 1}
        >
          <ChevronsLeft size={21} />
        </Button>
        <Button
          size={`sm`}
          variant={`outline`}
          onClick={onPaginate(page - 1)}
          disabled={page === 1}
          className={`px-2`}
        >
          <ChevronLeft size={21} />
        </Button>

        <Button
          size={`sm`}
          variant={`outline`}
          onClick={onPaginate(page + 1)}
          disabled={page === totalPages}
          className={`px-2`}
        >
          <ChevronRight size={21} />
        </Button>
        <Button
          size={`sm`}
          variant={`outline`}
          onClick={onPaginate(totalPages)}
          disabled={page === totalPages}
          className={`px-2`}
        >
          <ChevronsRight size={21} />
        </Button>
      </nav>
    </div>
  );
};
