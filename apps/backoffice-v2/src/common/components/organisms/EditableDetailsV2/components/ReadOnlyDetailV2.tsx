import { TextWithNAFallback, ctw } from '@ballerine/ui';
import { FunctionComponent, ComponentProps } from 'react';

export const ReadOnlyDetailV2: FunctionComponent<ComponentProps<typeof TextWithNAFallback>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <TextWithNAFallback
      as={'div'}
      tabIndex={0}
      role={'textbox'}
      aria-readonly
      {...props}
      className={ctw(
        'flex h-9 w-full max-w-[30ch] items-center break-all rounded-md border border-transparent p-1 pt-1.5 text-sm',
        className,
      )}
    >
      {children}
    </TextWithNAFallback>
  );
};
