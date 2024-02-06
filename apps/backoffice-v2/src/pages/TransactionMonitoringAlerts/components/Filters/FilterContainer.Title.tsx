import { ctw } from '@/common/utils/ctw/ctw';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface TitleProps {
  children?: AnyChildren;
  className?: string;
}

export const Title: FunctionComponent<TitleProps> = ({ children, className }) => {
  return (
    <div className="pb-6">
      <p className={ctw('leading-0 min-h-[16px] text-xs font-bold', className)}>{children}</p>
    </div>
  );
};
