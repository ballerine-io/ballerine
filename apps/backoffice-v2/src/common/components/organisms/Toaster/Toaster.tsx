import { Toaster as Sonner } from 'sonner';
import { ctw } from '@/common/utils/ctw/ctw';
import { ComponentProps } from 'react';

export type ToasterProps = ComponentProps<typeof Sonner>;

export const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light' as ToasterProps['theme']}
      className={ctw('toaster group', className)}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: '[&>div>svg]:fill-success',
          error: '[&>div>svg]:fill-destructive',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};
