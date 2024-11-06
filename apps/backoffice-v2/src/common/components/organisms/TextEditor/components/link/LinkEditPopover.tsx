import * as React from 'react';
import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import { Link2Icon } from '@radix-ui/react-icons';
import { ToolbarButton } from '../ToolbarButton';
import { LinkEditBlock } from './LinkEditBlock';
import { toggleVariants } from '@/common/components/atoms/Toggle/Toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';

interface LinkEditPopoverProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

const LinkEditPopover = ({ editor, size, variant }: LinkEditPopoverProps) => {
  const [open, setOpen] = React.useState(false);

  const { from, to } = editor.state.selection;
  const text = editor.state.doc.textBetween(from, to, ' ');

  const onSetLink = React.useCallback(
    (url: string, text?: string) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .insertContent({
          type: 'text',
          text: text || url,
          marks: [
            {
              type: 'link',
              attrs: {
                href: url,
                target: '_blank',
              },
            },
          ],
        })
        .setLink({ href: url })
        .run();

      editor.commands.enter();
    },
    [editor],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('link')}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive('codeBlock')}
          size={size}
          variant={variant}
        >
          <Link2Icon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="min-w-80 w-full" align="end" side="bottom">
        <LinkEditBlock onSave={onSetLink} defaultText={text} />
      </PopoverContent>
    </Popover>
  );
};

export { LinkEditPopover };
