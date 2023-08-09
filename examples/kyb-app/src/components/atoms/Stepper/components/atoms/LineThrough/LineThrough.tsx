import clsx from 'clsx';

interface Props {
  orientation?: 'vertical';
  lineSizeClassName: string;
}

export const LineThrough = ({ lineSizeClassName, orientation = 'vertical' }: Props) => {
  const sizeCls = clsx({ ['h-full']: orientation === 'vertical' });

  return (
    <div className={clsx(sizeCls, 'absolute flex justify-center', 'z-[-1]', lineSizeClassName)}>
      <div className={clsx(sizeCls, 'ml-[-1px] w-[2px] border-r border-dotted')}></div>
    </div>
  );
};
