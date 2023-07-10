import classnames from 'classnames';

interface Props {
  isFetching?: boolean;
  children: React.ReactNode;
}

export function TableContainer({ children, isFetching }: Props) {
  return (
    <div
      className={classnames('relative w-full overflow-auto bg-white', 'h-full  rounded-md border', {
        ['opacity-40']: isFetching,
        ['pointer-events-none']: isFetching,
      })}
      children={children}
    />
  );
}

TableContainer.displayName = 'TableContainer';
