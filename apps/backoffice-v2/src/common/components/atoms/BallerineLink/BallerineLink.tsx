import { buttonVariants } from '@/common/components/atoms/Button/Button';
import React, { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

export const BallerineLink: FunctionComponent<ComponentProps<'a'>> = ({
  className,
  href,
  children,
  ...props
}) => {
  return (
    <a
      className={ctw(
        buttonVariants({
          variant: 'link',
        }),
        'h-[unset] cursor-pointer !p-0 !text-blue-500',
        className,
      )}
      target={'_blank'}
      rel={'noopener noreferrer'}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
};
