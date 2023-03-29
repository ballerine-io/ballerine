import { Actions } from './Subject.Actions';
import { Documents } from './Subject.Documents';
import { Info } from './Subject.Info';
import { Content } from './Subject.Content';
import { FaceMatch } from './Subject.FaceMatch';
import { TState } from '@/types';

export interface IItemProps {
  id: string;
  fullName: string;
  createdAt: string;
  avatarUrl: string;
  assignedTo: string;
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
}

export interface ISubjectChildren {
  Actions: typeof Actions;
  Content: typeof Content;
  FaceMatch: typeof FaceMatch;
  Info: typeof Info;
  Documents: typeof Documents;
}

export interface IDocumentsProps {
  documents: Array<{
    imageUrl: string;
    caption: string;
  }>;
  isLoading?: boolean;
}

export interface IFaceMatchProps {
  faceAUrl: string;
  faceBUrl: string;
  isLoading?: boolean;
}
