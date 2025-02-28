import { ctw } from '@ballerine/ui';
import { Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/common/components/atoms/Button/Button';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { MinimalTiptapEditor } from '@/common/components/organisms/TextEditor';
import { useNotesLogic } from '@/domains/notes/hooks/useNotesLogic';
import { Note } from './Note';
import type { TNoteableType, TNotes } from './types';

export const Notes = ({
  notes,
  noteData,
}: {
  notes: TNotes;
  noteData: {
    entityId: string;
    entityType: 'Business' | 'EndUser';
    noteableId: string;
    noteableType: TNoteableType;
  };
}) => {
  const { form, users, onSubmit, isLoading } = useNotesLogic();

  return (
    <div className={`flex h-full w-full flex-col bg-slate-50`}>
      <div className={`h-12 flex-row items-center justify-between border-b p-4`}>
        <span className={`text-sm font-medium`}>Notes</span>
      </div>
      <div className={`flex flex-col gap-1 border-none`}>
        <div className={`p-4`}>
          <Form {...form}>
            <form
              className={`flex flex-col`}
              onSubmit={form.handleSubmit(formData =>
                onSubmit({
                  ...noteData,
                  ...formData,
                  parentNoteId: null,
                }),
              )}
            >
              <FormField
                control={form.control}
                name={`content`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MinimalTiptapEditor
                        className="w-full bg-white"
                        editorContentClassName="p-2 text-sm h-[120px] overflow-y-auto"
                        output="html"
                        placeholder="Add a note..."
                        autofocus={true}
                        editable={true}
                        editorClassName="focus:outline-none h-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={`ps-2`} />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size={`sm`}
                aria-disabled={isLoading}
                className={
                  'mt-3 h-5 self-end p-4 text-sm font-medium enabled:bg-primary enabled:hover:bg-primary/90 aria-disabled:pointer-events-none aria-disabled:opacity-50'
                }
              >
                <Loader2 className={ctw('me-2 h-4 w-4 animate-spin', { hidden: !isLoading })} />
                Submit
              </Button>
            </form>
          </Form>
        </div>

        <Separator />

        <div className={`space-y-4 p-4`}>
          {(notes || []).map(note => (
            <Note
              key={note.id}
              {...note}
              user={(users || []).find(user => user.id === note.createdBy)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
