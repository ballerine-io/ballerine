import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { CommonWorkflowStates } from '@ballerine/common';

export interface ICaseCallToActionProps {
  value: string;
  data: {
    parentWorkflowId: string;
    childWorkflowId: string;
    childWorkflowContextSchema: TWorkflowById['childWorkflows'][number]['workflowDefinition']['contextSchema'];
    disabled: boolean;
    decision:
      | CommonWorkflowStates.REJECTED
      | CommonWorkflowStates.APPROVED
      | CommonWorkflowStates.REVISION;
  };
}
