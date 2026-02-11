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
        success: <CheckCircle2 size={18} />,
        info: <Info size={18} />,
        error: <AlertCircle size={18} />,
        warning: <AlertTriangle size={18} />,
      }}
      closeButton
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: 'group toast group-[.toaster]:shadow-lg font-inter',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          closeButton: 'group-[.toast]:opacity-70 group-[.toast]:hover:opacity-100',
        },
      }}
      {...props}
    />
  );
};
