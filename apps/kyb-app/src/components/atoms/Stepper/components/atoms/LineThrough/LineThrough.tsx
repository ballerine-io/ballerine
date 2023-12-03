import { ctw } from '@ballerine/ui';

interface Props {
  orientation?: 'vertical';
  lineSizeClassName: string;
}

export const LineThrough = ({ lineSizeClassName, orientation = 'vertical' }: Props) => {
  const sizeCls = ctw({ ['h-full']: orientation === 'vertical' });

  return (
    <div className={ctw(sizeCls, 'absolute flex justify-center', 'z-[-1]', lineSizeClassName)}>
      <div className={ctw(sizeCls, 'ml-[-1px] w-[2px] border-r border-dotted')}></div>
    </div>
  );
};
