import type { FunctionComponent, ComponentProps } from 'react';

import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { SheetContent } from '@/common/components/atoms/Sheet/Sheet.Content';
import { SheetTrigger } from '@/common/components/atoms/Sheet/Sheet.Trigger';
import { Notes } from './Notes';

export type NotesSheetProps = ComponentProps<typeof Sheet> &
  ComponentProps<typeof Notes> & { children: React.ReactNode };

export const NotesSheet: FunctionComponent<NotesSheetProps> = ({
  open,
  onOpenChange,
  defaultOpen,
  modal = false,
  children,
  ...notesProps
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={modal} defaultOpen={defaultOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent onPointerDownOutside={e => e.preventDefault()} className="p-0">
        <Notes {...notesProps} />
      </SheetContent>
    </Sheet>
  );
};
