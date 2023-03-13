import { FunctionComponent, PropsWithChildren } from 'react';
import { Actions } from 'components/organisms/Subject/Subject.Actions';
import { Documents } from 'components/organisms/Subject/Subject.Documents';
import { Info } from 'components/organisms/Subject/Subject.Info';
import { Content } from 'components/organisms/Subject/Subject.Content';
import { ISubjectChildren } from 'components/organisms/Subject/interfaces';
import { FaceMatch } from 'components/organisms/Subject/Subject.FaceMatch';

/**
 * @description A component which handles a single end user's reject/approve mutation, and displays the user's information and documents.
 * Uses dot notation for its API (i.e. Subject.List), where the root component acts as a container.
 *
 * Children:
 * - {@link Subject.Actions} - Displays the end user's full name and contains the reject and approve actions.
 * - {@link Subject.Content} - Acts as a container for {@link Subject.Info} and {@link Subject.Documents}.
 * - {@link Subject.Info} - Displays the end user's personal information and verification status.
 * - {@link Subject.Documents} - Displays the end user's documents.
 *
 * @see {@link https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type|React dot notation}
 *
 * @param props
 * @constructor
 */
export const Subject: FunctionComponent<PropsWithChildren> & ISubjectChildren = ({ children }) => {
  return <div className={`flex h-full flex-col`}>{children}</div>;
};

Subject.Actions = Actions;
Subject.Content = Content;
Subject.FaceMatch = FaceMatch;
Subject.Info = Info;
Subject.Documents = Documents;
