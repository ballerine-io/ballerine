import * as React from 'react';
import { motion } from 'framer-motion';
import { TextArea } from '@ballerine/ui';
import { Loader2, X } from 'lucide-react';

import { NoteableType } from './types';
import { ctw } from '@/common/utils/ctw/ctw';
import { useNotes } from '@/domains/notes/hooks/useNotes';
import { Button } from '@/common/components/atoms/Button/Button';
import { useNotesLogic } from '@/pages/Entity/components/Notes/hooks/useNotesLogic';

export const Notes = ({
  notes,
  displayName,
  entityId,
  entityType,
  noteableId,
  noteableType,
}: {
  notes: any[];
  displayName: string;
  entityId: string;
  entityType: 'Business' | 'EndUser';
  noteableId: string;
  noteableType: NoteableType;
}) => {
  const { toggleNotes } = useNotes();
  const { note, onNoteChange, onSubmit } = useNotesLogic();

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex h-full flex-col bg-[#F4F6FD]`}
    >
      <div className={`flex h-[72px] items-center justify-between bg-[#E7EBF7] p-6`}>
        <span className={`text-lg font-semibold`}>{displayName}</span>
        <X
          className="cursor-pointer d-6"
          onClick={event => {
            event.stopPropagation();
            toggleNotes();
          }}
        />
      </div>
      <div className={`m-6 flex flex-col`}>
        <div className={`text-lg font-bold`}>Notes</div>
        <TextArea
          value={note}
          onChange={onNoteChange}
          style={{ resize: 'none' }}
          placeholder={'Add a note'}
          className={`mt-5 h-[142px]`}
        />
        <Button
          type="submit"
          size={`wide`}
          onClick={() =>
            onSubmit({
              entityId,
              entityType,
              noteableId,
              noteableType,
              content: note,
              parentNoteId: null,
            })
          }
          aria-disabled={false}
          className={'mt-3 self-end aria-disabled:pointer-events-none aria-disabled:opacity-50'}
        >
          <Loader2 className={ctw('me-2 h-4 w-4 animate-spin', { hidden: !false })} />
          Submit
        </Button>
      </div>
    </motion.div>
  );
};
