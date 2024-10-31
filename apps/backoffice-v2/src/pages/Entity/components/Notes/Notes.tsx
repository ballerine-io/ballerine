import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import { ctw, TextArea } from '@ballerine/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import { Note } from './Note';
import { NoteableType, TNotes } from './types';
import { useNotes } from '@/domains/notes/hooks/useNotes';
import { Form } from '@/common/components/organisms/Form/Form';
import { Button } from '@/common/components/atoms/Button/Button';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from './Sidebar';
import { useNotesLogic } from '@/pages/Entity/components/Notes/hooks/useNotesLogic';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { CreateNoteSchema } from '@/pages/Entity/components/Notes/hooks/schemas/create-note-schema';

export const Notes = ({
  notes,
  displayName,
  ...data
}: {
  notes: TNotes;
  displayName: string;
  entityId: string;
  entityType: 'Business' | 'EndUser';
  noteableId: string;
  noteableType: NoteableType;
}) => {
  const { toggleNotes } = useNotes();
  const { onSubmit } = useNotesLogic();
  const { data: users } = useUsersQuery();

  const form = useForm({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(CreateNoteSchema.pick({ content: true })),
  });

  return (
    <Sidebar side={`right`} className={`bg-[#F4F6FD]`}>
      <SidebarHeader className={`h-[72px] flex-row items-center justify-between bg-[#E7EBF7] p-6`}>
        <span className={`text-lg font-semibold`}>{displayName}</span>
        <X
          className="cursor-pointer d-6"
          onClick={() => {
            toggleNotes();
          }}
        />
      </SidebarHeader>
      <SidebarContent className={`m-6 flex flex-col`}>
        <div className={`text-lg font-bold`}>Notes</div>
        <SidebarGroup>
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
                      <TextArea
                        placeholder={'Add a note'}
                        className={`mt-5 h-[142px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size={`wide`}
                aria-disabled={false}
                className={
                  'mt-3 self-end aria-disabled:pointer-events-none aria-disabled:opacity-50'
                }
              >
                <Loader2 className={ctw('me-2 h-4 w-4 animate-spin', { hidden: !false })} />
                Submit
              </Button>
            </form>
          </Form>
        </SidebarGroup>
        <SidebarGroup className={`space-y-5`}>
          {notes.map(note => (
            <Note
              key={note.id}
              {...note}
              user={(users || []).find(user => user.id === note.createdBy)}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
