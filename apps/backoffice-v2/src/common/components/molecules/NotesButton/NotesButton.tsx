import { Link } from 'react-router-dom';
import { SquarePen } from 'lucide-react';

import { ctw } from '@/common/utils/ctw/ctw';
import { useUpdateIsNotesOpen } from '@/common/hooks/useUpdateIsNotesOpen/useUpdateIsNotesOpen';

interface INotesButtonProps {
  numberOfNotes: number | undefined;
}

export const NotesButton = ({ numberOfNotes = 0 }: INotesButtonProps) => {
  const updateIsNotesOpen = useUpdateIsNotesOpen();

  return (
    <div className={`flex items-center space-x-2`}>
      <span className={`me-2 text-sm leading-6`}>Notes</span>
      <Link
        className={`relative`}
        to={{
          search: updateIsNotesOpen(),
        }}
      >
        <SquarePen className={`d-5`} />
        {numberOfNotes > 0 && (
          <div
            className={ctw(
              `absolute left-3 top-3 rounded-full bg-slate-600 text-center text-[10px] font-bold text-white`,
              { 'd-[14px]': numberOfNotes < 10, 'h-3.5 w-5 ps-[3px]': numberOfNotes >= 10 },
            )}
          >
            {numberOfNotes > 9 ? '9+' : numberOfNotes}
          </div>
        )}
      </Link>
    </div>
  );
};
