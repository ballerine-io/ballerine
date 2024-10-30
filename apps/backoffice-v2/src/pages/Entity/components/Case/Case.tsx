import { FunctionComponent, PropsWithChildren } from 'react';
import { Actions } from './Case.Actions';
import { Content } from './Case.Content';
import { Documents } from './Case.Documents';
import { FaceMatch } from './Case.FaceMatch';
import { Info } from './Case.Info';
import { ICaseChildren } from './interfaces';
import { ctw } from '@ballerine/ui';
import { useNotes } from '@/domains/notes/hooks/useNotes';

/**
 * @description A component which handles a single case's reject/approve mutation, and displays the entity's information and documents.
 * Uses dot notation for its API (i.e. Case.List), where the root component acts as a container.
 *
 * Children:
 * - {@link Case.Actions} - Displays the entity's full name and contains the reject and approve actions.
 * - {@link Case.Content} - Acts as a container for {@link Case.Info} and {@link Case.Documents}.
 * - {@link Case.Info} - Displays the entity's personal information and verification status.
 * - {@link Case.Documents} - Displays the case's documents.
 *
 * @see {@link https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type|React dot notation}
 *
 * @param props
 * @constructor
 */
export const Case: FunctionComponent<PropsWithChildren> & ICaseChildren = ({ children }) => {
  const { isNotesOpen } = useNotes();

  return (
    <div className={ctw(`col-span-3 flex h-full flex-col`, { 'col-span-2': isNotesOpen })}>
      {children}
    </div>
  );
};

Case.Actions = Actions;
Case.Content = Content;
Case.FaceMatch = FaceMatch;
Case.Info = Info;
Case.Documents = Documents;
