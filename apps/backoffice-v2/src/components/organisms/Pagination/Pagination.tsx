import { FunctionComponent } from 'react';
import { ctw } from '@/utils/ctw/ctw';
import { IPaginationProps } from '@/components/organisms/Pagination/interfaces';
import { Button } from '@/components/atoms/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination: FunctionComponent<IPaginationProps> = ({
  onPaginate,
  page,
  pages,
  totalPages,
}) => {
  return (
    <nav className={`btn-group flex justify-center`}>
      <Button variant={'default'} onClick={onPaginate(page - 1)} disabled={page === 1}>
        <ChevronLeft />
      </Button>

      {pages?.map(num => (
        <Button
          variant={'default'}
          onClick={onPaginate(num)}
          className={ctw({
            'bg-primary': num === page,
          })}
          key={`pagination-item-${num}`}
        >
          {num}
        </Button>
      ))}

      <Button variant={'default'} onClick={onPaginate(page + 1)} disabled={page === totalPages}>
        <ChevronRight />
      </Button>
    </nav>
  );
};
