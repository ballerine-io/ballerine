import { TWorkflowById } from '../../../../domains/workflows/fetchers';

export interface ICaseCallToActionProps {
  value: string;
  data: {
    parentWorkflowId: string;
    childWorkflowId: string;
    childWorkflowContextSchema: TWorkflowById['childWorkflows'][number]['workflowDefinition']['contextSchema'];
    disabled: boolean;
    approvalStatus: 'rejected' | 'approved' | 'revision';
  };
}
