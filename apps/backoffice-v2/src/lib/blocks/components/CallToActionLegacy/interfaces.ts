import { TWorkflowById } from '@/domains/workflows/fetchers';
import { FunctionComponent } from 'react';

export interface ICallToActionLegacyProps {
  value: {
    text: string;
    props: {
      id: string;
      workflow: TWorkflowById;
      disabled: boolean;
      decision: 'reject' | 'approve' | 'revision' | 'revised';
      contextUpdateMethod?: 'base' | 'director';
      revisionReasons?: string[];
      rejectionReasons?: string[];
      onReuploadReset?: () => void;
      onReuploadNeeded: ({
        workflowId,
        documentId,
        reason,
      }: {
        workflowId: string;
        documentId: string;
        reason?: string;
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
