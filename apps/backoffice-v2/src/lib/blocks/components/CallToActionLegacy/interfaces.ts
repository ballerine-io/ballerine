import { TWorkflowById } from '@/domains/workflows/fetchers';
import { FunctionComponent } from 'react';

export interface ICallToActionLegacyProps {
  value: {
    text: string;
    props: {
      id: string;
      directorId?: string;
      workflow: TWorkflowById;
      disabled: boolean;
      decision: 'reject' | 'approve' | 'revision';
      contextUpdateMethod?: 'base' | 'director';
      revisionReasons?: string[];
      rejectionReasons?: string[];
      onReuploadReset?: () => void;
      onReuploadNeeded: ({
        workflowId,
        directorId,
        documentId,
        reason,
        comment,
      }: {
        workflowId: string;
        directorId?: string;
        documentId: string;
        reason?: string;
        comment?: string;
      }) => () => void;
      isLoadingReuploadNeeded: boolean;
      onDialogClose?: () => void;
      dialog: {
        reupload: {
          Description: FunctionComponent;
        };
      };
    };
  };
}
