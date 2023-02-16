import { FunctionComponent } from 'react';
import { ChevronLeftSvg, ChevronRightSvg } from 'components/atoms/icons';
import { ctw } from '../../../utils/ctw/ctw';
import { IPaginationProps } from 'components/organisms/Pagination/interfaces';

export const Pagination: FunctionComponent<IPaginationProps> = ({
  onPaginate,
  page,
  pages,
  totalPages,
}) => {
  return (
    <nav className={`btn-group flex justify-center`}>
      <button
        className={'btn focus:outline-primary'}
        onClick={onPaginate(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeftSvg />
      </button>

      {pages?.map(num => (
        <button
          onClick={onPaginate(num)}
          className={ctw('btn focus:outline-primary', {
            'btn-active': num === page,
          })}
          key={`pagination-item-${num}`}
        >
          {num}
        </button>
      ))}

      <button
        className={'btn focus:outline-primary'}
        onClick={onPaginate(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRightSvg />
      </button>
    </nav>
  );
};
