import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateNoteMutation } from '@/pages/Entity/components/Notes/hooks/mutations/useCreateNoteMutation/useCreateNoteMutation';
import { CreateNoteSchema } from '@/pages/Entity/components/Notes/hooks/schemas/create-note-schema';
import { useNotes } from '@/domains/notes/hooks/useNotes';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { zodResolver } from '@hookform/resolvers/zod';

export const useNotesLogic = () => {
  const { toggleNotes } = useNotes();
  const { data: users } = useUsersQuery();

  const form = useForm({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(CreateNoteSchema.pick({ content: true })),
  });

  const { mutate: mutateCreateNote, isLoading: isSubmitting } = useCreateNoteMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit: SubmitHandler<z.output<typeof CreateNoteSchema>> = data => {
    mutateCreateNote(data);
  };

  return {
    form,
    users,
    onSubmit,
    toggleNotes,
    isLoading: isSubmitting,
  };
};
