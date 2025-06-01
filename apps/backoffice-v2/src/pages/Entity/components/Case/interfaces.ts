import { ComponentProps } from 'react';

import { TStateTags } from '@ballerine/common';
import { TAssignee } from '../../../../common/components/atoms/AssignDropdown/AssignDropdown';
import { Actions } from './Case.Actions';
import { Content } from './Case.Content';
import { Documents } from './Case.Documents';
import { Info } from './Case.Info';

export interface IItemProps {
  id: string;
  fullName: string;
  createdAt: string;
  entityAvatarUrl: string;
  assignee: TAssignee | null;
  tags: TStateTags;
}

export interface IInfoProps {
  info: Record<PropertyKey, unknown>;
  whitelist: string[];
  isLoading?: boolean;
}

export interface IActionsProps {
  id: string;
  entityId: string;
  fullName: string;
  showResolutionButtons?: boolean;
}

export interface ICaseChildren {
  Actions: typeof Actions;
  Content: typeof Content;
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
  onOcrPressed: () => void;
  isLoading?: boolean;
  isLoadingOCR?: boolean;
  isDocumentEditable?: boolean;
  hideOpenExternalButton?: boolean;
  wrapperClassName?: string;
}
