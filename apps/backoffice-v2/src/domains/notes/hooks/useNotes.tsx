import { z } from 'zod';
import { useCallback } from 'react';
import { ParsedBooleanSchema } from '@ballerine/ui';

import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';

const NotesSchema = z.object({ isNotesOpen: ParsedBooleanSchema.catch(false) });

export const useNotes = () => {
  const [{ isNotesOpen }, setSearchParams] = useZodSearchParams(NotesSchema);

  const toggleNotes = useCallback(() => {
    setSearchParams({ isNotesOpen: !isNotesOpen });
  }, [setSearchParams, isNotesOpen]);

  return { isNotesOpen, toggleNotes };
};
