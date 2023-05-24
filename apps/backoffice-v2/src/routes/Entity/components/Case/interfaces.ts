import { Actions } from './Case.Actions';
import { Documents } from './Case.Documents';
import { Info } from './Case.Info';
import { Content } from './Case.Content';
import { FaceMatch } from './Case.FaceMatch';
import { TState } from '../../../../common/types';
import { ComponentProps } from 'react';

export interface IItemProps {
  id: string;
  fullName: string;
  createdAt: string;
  avatarUrl: string;
  assigneeId: string;
  assigneeFullName: string;
  status: TState;
}

export interface IInfoProps {
  info: Record<PropertyKey, unknown>;
  whitelist: Array<string>;
  isLoading?: boolean;
}

export interface IActionsProps {
  id: string;
  fullName: string;
  avatarUrl: string;
  showResolutionButtons?: boolean;
}

export interface ICaseChildren {
  Actions: typeof Actions;
  Content: typeof Content;
  FaceMatch: typeof FaceMatch;
  Info: typeof Info;
  Documents: typeof Documents;
}

export interface IDocumentsProps {
  documents: Array<{
    imageUrl: string;
    fileType: string;
    title: string;
  }>;
  isLoading?: boolean;
}

export interface IFaceMatchProps extends ComponentProps<'div'> {
  faceAUrl: string;
  faceBUrl: string;
  isLoading?: boolean;
}
