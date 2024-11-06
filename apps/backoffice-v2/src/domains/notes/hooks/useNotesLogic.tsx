import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useUpdateIsNotesOpen } from '@/common/hooks/useUpdateIsNotesOpen/useUpdateIsNotesOpen';
import { CreateNoteSchema } from '@/domains/notes/hooks/schemas/create-note-schema';
import { useCreateNoteMutation } from '@/domains/notes/hooks/mutations/useCreateNoteMutation/useCreateNoteMutation';

export const useNotesLogic = () => {
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

  const updateIsNotesOpen = useUpdateIsNotesOpen();

  return {
    form,
    users,
    onSubmit,
    updateIsNotesOpen,
    isLoading: isSubmitting,
  };
};
