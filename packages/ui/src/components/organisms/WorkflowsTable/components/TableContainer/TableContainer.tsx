import { ctw } from '@/utils/ctw';

interface Props {
  isFetching?: boolean;
  children: React.ReactNode;
}

export function TableContainer({ children, isFetching }: Props) {
  return (
    <div
      className={ctw('relative w-full overflow-auto bg-white', 'h-full  rounded-md border', {
        ['opacity-40']: isFetching,
        ['pointer-events-none']: isFetching,
      })}
    >
      {children}
    </div>
  );
}

TableContainer.displayName = 'TableContainer';
