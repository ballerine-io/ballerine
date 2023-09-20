import { TWorkflowById } from '../../../../domains/workflows/fetchers';

export interface ICaseCallToActionProps {
  value: string;
  data: {
    parentWorkflowId: string;
    childWorkflowId: string;
    childWorkflowContextSchema: TWorkflowById['childWorkflows'][number]['workflowDefinition']['contextSchema'];
    disabled: boolean;
    decision: 'rejected' | 'approved' | 'revision';
  };
}
