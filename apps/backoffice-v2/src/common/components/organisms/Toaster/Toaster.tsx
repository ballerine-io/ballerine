import { ctw } from '@/common/utils/ctw/ctw';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';

export type ToasterProps = ComponentProps<typeof Sonner>;

export const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      className={ctw('toaster group', className)}
      richColors
      icons={{
        success: <CheckCircle2 size="medium" />,
        info: <Info size="medium" />,
        error: <AlertCircle size="medium" />,
        warning: <AlertTriangle size="medium" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: 'group toast group-[.toaster]:shadow-lg font-inter',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};
