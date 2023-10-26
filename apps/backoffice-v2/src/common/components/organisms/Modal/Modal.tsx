import { FunctionComponent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkSvg } from '../../atoms/icons';
import { IModalProps } from './interfaces';
import { ctw } from '../../../utils/ctw/ctw';
import { MotionScrollArea } from '../../molecules/MotionScrollArea/MotionScrollArea';

/**
 *
 * @description Wraps {@link https://www.radix-ui.com/|Radix UI}'s {@link https://www.radix-ui.com/docs/primitives/components/dialog|Dialog} component with default styling. Modal state is passed in to allow global modals and passing the state through context.
 *
 * @param props
 * @param props.children - The content to display within the {@link Dialog.Content} component.
 * @param props.isOpen - Whether the modal is open or not.
 * @param props.onIsOpenChange - Callback to toggle isOpen, expects a function that takes the next state as an argument.
 * @param props.title - Title of the modal.
 * @param props.hideTitle - When true makes the title of the modal be visible only to screen readers.
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/dialog|Radix UI Dialog documentation}
 *
 * @constructor
 */
export const Modal: FunctionComponent<IModalProps> = ({
  children,
  className,
  isOpen,
  onIsOpenChange,
  title,
  hideTitle,
  ...props
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onIsOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <div
            className={ctw(`modal`, {
              'modal-open': isOpen,
            })}
          >
            <Dialog.Content className={ctw(`modal-box w-full max-w-7xl`, className)} {...props}>
              <div className={`flex justify-end`}>
                <Dialog.Close
                  className={`btn btn-square btn-ghost  btn-sm mb-4 focus:outline-primary`}
                  aria-label={`Close`}
                >
                  <XMarkSvg />
                </Dialog.Close>
              </div>

              <Dialog.Title
                className={ctw(`font-bolt text-2xl`, {
                  'sr-only': hideTitle,
                })}
              >
                {title}
              </Dialog.Title>

              {/* Prevents CLS of the close button when the overflow of the content changes. */}
              <MotionScrollArea className={`h-[768px] rounded-md`}>{children}</MotionScrollArea>
            </Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
