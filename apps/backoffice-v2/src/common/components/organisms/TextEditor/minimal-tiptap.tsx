import * as React from 'react';
import { useEffect } from 'react';
import { ctw } from '@ballerine/ui';
import { EditorContent } from '@tiptap/react';
import type { Content, Editor } from '@tiptap/react';

import { SectionTwo } from './components/section/two';
import { SectionFour } from './components/section/four';
import { SectionFive } from './components/section/five';
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap';
import { MeasuredContainer } from './components/MeasuredContainer';
import { LinkBubbleMenu } from './components/bubble-menu/LinkBubbleMenu';
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap';

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px space-x-2">
      <SectionTwo
        editor={editor}
        activeActions={['bold', 'italic', 'strikethrough', 'code', 'clearFormatting']}
        mainActionCount={2}
      />

      <SectionFour
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />

      <SectionFive
        editor={editor}
        activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    });

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value ?? '');
      }
    }, [value, editor]);

    if (!editor) {
      return null;
    }

    return (
      <MeasuredContainer
        as="div"
        name="editor"
        ref={ref}
        className={ctw(
          'flex h-auto min-h-[72px] w-full flex-col rounded-md border border-input shadow-sm',
          className,
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={ctw('minimal-tiptap-editor h-full', editorContentClassName)}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    );
  },
);

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor';

export default MinimalTiptapEditor;
