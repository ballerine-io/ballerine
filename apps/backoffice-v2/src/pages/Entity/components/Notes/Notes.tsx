import * as React from 'react';
import { Loader2, X } from 'lucide-react';
import { ctw } from '@ballerine/ui';

import { Note } from './Note';
import { NoteableType, TNotes } from './types';
import { Form } from '@/common/components/organisms/Form/Form';
import { Button } from '@/common/components/atoms/Button/Button';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { MinimalTiptapEditor } from '@/common/components/organisms/Editor';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from './Sidebar';
import { useNotesLogic } from '@/pages/Entity/components/Notes/hooks/useNotesLogic';

const fallbackUser = {
  id: 'test',
  firstName: 'test',
  lastName: 'test',
  fullName: 'test',
  avatarUrl: 'test',
  email: 'test',
  phone: 'test',
  createdAt: 'test',
  updatedAt: 'test',
};

export const Notes = ({
  notes,
  ...data
}: {
  notes: TNotes;
  entityId: string;
  entityType: 'Business' | 'EndUser';
  noteableId: string;
  noteableType: NoteableType;
}) => {
  const { form, users, toggleNotes, onSubmit, isLoading } = useNotesLogic();

  return (
    <Sidebar side={`right`} className={`bg-slate-50`}>
      <SidebarHeader className={`h-12 flex-row items-center justify-between border-b p-4`}>
        <span className={`text-sm font-medium`}>Notes</span>
        <X
          className="cursor-pointer d-4"
          onClick={() => {
            toggleNotes();
          }}
        />
      </SidebarHeader>
      <SidebarContent className={`flex flex-col gap-1 border-none`}>
        <SidebarGroup className={`p-4`}>
          <Form {...form}>
            <form
              className={`flex flex-col`}
              onSubmit={form.handleSubmit(formData =>
                onSubmit({
                  ...data,
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
                        editorContentClassName="ps-4 pt-4 text-sm h-[120px]"
                        output="html"
                        placeholder="Add a note..."
                        autofocus={true}
                        editable={true}
                        editorClassName="focus:outline-none"
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
                  'mt-3 h-5 self-end p-4 text-sm font-medium aria-disabled:pointer-events-none aria-disabled:opacity-50'
                }
              >
                <Loader2 className={ctw('me-2 h-4 w-4 animate-spin', { hidden: !isLoading })} />
                Submit
              </Button>
            </form>
          </Form>
        </SidebarGroup>
        <SidebarGroup className={`p-0`}>
          <Separator />
        </SidebarGroup>
        <SidebarGroup className={`space-y-4 p-4`}>
          {notes.map(note => (
            <Note
              key={note.id}
              {...note}
              user={(users || []).find(user => user.id === note.createdBy) ?? fallbackUser}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
