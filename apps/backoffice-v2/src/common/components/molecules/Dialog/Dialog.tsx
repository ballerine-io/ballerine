import { Dialog as ShadCNDialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { DialogContent } from '../../organisms/Dialog/Dialog.Content';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../organisms/Dialog/Dialog.Title';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { ctw } from '@ballerine/ui';
import { AnimatePresence } from 'framer-motion';
import { DialogClose } from '@radix-ui/react-dialog';

export interface DialogProps extends ComponentProps<typeof ShadCNDialog> {
  trigger: ReactNode | ReactNode[];
  content: ReactNode | ReactNode[];
  title?: ReactNode | ReactNode[];
  description?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
  close?: ReactNode | ReactNode[];
  props?: {
    dialog?: ComponentProps<typeof ShadCNDialog>;
    trigger?: ComponentProps<typeof DialogTrigger>;
    content?: ComponentProps<typeof DialogContent>;
    header?: ComponentProps<typeof DialogHeader>;
    title?: ComponentProps<typeof DialogTitle>;
    description?: ComponentProps<typeof DialogDescription>;
    footer?: ComponentProps<typeof DialogFooter>;
    close?: ComponentProps<typeof DialogClose>;
  };
}

export const Dialog: FunctionComponent<DialogProps> = ({
  trigger,
  title,
  description,
  content,
  footer,
  close,
  props,
  ...rest
}) => {
  return (
    <ShadCNDialog {...rest}>
      <AnimatePresence>
        <DialogTrigger asChild={typeof trigger !== 'string'} {...props?.trigger}>
          {trigger}
        </DialogTrigger>
      </AnimatePresence>
      <DialogContent {...props?.content} className={ctw(props?.content?.className)}>
        {(title || description) && (
          <DialogHeader {...props?.header}>
            {title && <DialogTitle {...props?.title}>{title}</DialogTitle>}
            {description && (
              <DialogDescription {...props?.description}>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {content}
        {(footer || close) && (
          <DialogFooter {...props?.footer}>
            {footer}
            {close && (
              <DialogClose asChild={typeof close !== 'string'} {...props?.close}>
                {close}
              </DialogClose>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </ShadCNDialog>
  );
};
