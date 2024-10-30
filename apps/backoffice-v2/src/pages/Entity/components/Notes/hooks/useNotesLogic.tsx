import { z } from 'zod';
import { useCallback, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { useCreateNoteMutation } from '@/pages/Entity/components/Notes/hooks/mutations/useCreateNoteMutation/useCreateNoteMutation';
import { CreateNoteSchema } from '@/pages/Entity/components/Notes/hooks/create-note-schema';

export const useNotesLogic = () => {
  const [note, setNote] = useState('');

  const onNoteChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  }, []);

  const { mutate: mutateCreateNote, isLoading: isSubmitting } = useCreateNoteMutation({});

  const onSubmit: SubmitHandler<z.output<typeof CreateNoteSchema>> = data => {
    mutateCreateNote(data);
  };

  return {
    note,
    onSubmit,
    onNoteChange,
    isLoading: isSubmitting,
  };
};
