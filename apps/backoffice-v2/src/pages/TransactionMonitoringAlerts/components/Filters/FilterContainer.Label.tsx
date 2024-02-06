import { ctw } from '@/common/utils/ctw/ctw';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface LabelProps {
  children: AnyChildren;
  htmlFor?: string;
  className?: string;
}

export const Label: FunctionComponent<LabelProps> = ({ children, className, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={ctw('absolute top-[24px] text-xs font-bold text-[#00000059]', className)}
    >
      {children}
    </label>
  );
};
