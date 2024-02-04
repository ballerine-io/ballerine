import { ComponentProps } from 'react';

import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TStateTags } from '@ballerine/common';
import { Assignee } from '../../../../common/components/atoms/AssignDropdown/AssignDropdown';
import { Actions } from './Case.Actions';
import { Content } from './Case.Content';
import { Documents } from './Case.Documents';
import { FaceMatch } from './Case.FaceMatch';
import { Info } from './Case.Info';

export interface IItemProps {
  id: string;
  fullName: string;
  createdAt: string;
  entityAvatarUrl: string;
  assignee: Assignee | null;
  tags: TStateTags;
}

export interface IInfoProps {
  info: Record<PropertyKey, unknown>;
  whitelist: string[];
  isLoading?: boolean;
}

export interface IActionsProps {
  id: string;
  fullName: string;
  avatarUrl: string;
  showResolutionButtons?: boolean;
  workflow: TWorkflowById;
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
    id: string;
    imageUrl: string;
    fileType: string;
    fileName: string;
    title: string;
  }>;
  isLoading?: boolean;
  hideOpenExternalButton?: boolean;
}

export interface IFaceMatchProps extends ComponentProps<'div'> {
  faceAUrl: string;
  faceBUrl: string;
  isLoading?: boolean;
}
