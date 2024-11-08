import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { ImageIcon } from '@radix-ui/react-icons';
import { ToolbarButton } from '../ToolbarButton';
import { ImageEditBlock } from './ImageEditBlock';
import { toggleVariants } from '@/common/components/atoms/Toggle/Toggle';
import { Dialog } from '../../../Dialog/Dialog';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { DialogContent } from '../../../Dialog/Dialog.Content';
import { DialogTitle } from '../../../Dialog/Dialog.Title';
import { DialogDescription } from '../../../Dialog/Dialog.Description';
import { DialogHeader } from '../../../Dialog/Dialog.Header';

interface ImageEditDialogProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

const ImageEditDialog = ({ editor, size, variant }: ImageEditDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('image')}
          tooltip="Image"
          aria-label="Image"
          size={size}
          variant={variant}
        >
          <ImageIcon className="size-5" />
        </ToolbarButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select image</DialogTitle>
          <DialogDescription className="sr-only">
            Upload an image from your computer
          </DialogDescription>
        </DialogHeader>
        <ImageEditBlock editor={editor} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export { ImageEditDialog };
