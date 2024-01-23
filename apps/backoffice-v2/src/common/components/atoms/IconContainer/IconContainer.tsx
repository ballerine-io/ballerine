import { ctw } from '@ballerine/ui';
import { LucideIcon } from 'lucide-react';
import { ComponentProps, FunctionComponent } from 'react';

export interface IIconContainerProps extends ComponentProps<'div'> {
  size?: number;
  children: ReturnType<LucideIcon>;
}

export const IconContainer: FunctionComponent<IIconContainerProps> = ({
  size = 24,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      style={{
        width: size * 0.9,
        height: size * 0.9,
        ...props.style,
      }}
      className={ctw(
        'grid place-content-center rounded-full border border-white bg-slate-200 p-0.5',
        props?.className,
      )}
    >
      {children}
    </div>
  );
};
