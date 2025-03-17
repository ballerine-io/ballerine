import { CommonWorkflowEvent, StateTag, TDocument } from '@ballerine/common';
import { IPendingEvent } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/interfaces';

export const calculatePendingWorkflowRevisionEvents = ({
  documents,
  directorsDocuments,
  workflowId,
  workflowState,
  token,
}: {
  documents: TDocument[];
  directorsDocuments: TDocument[];
  workflowId: string;
  workflowState: string;
  token: string;
}): Array<IPendingEvent> => {
  return [...documents, ...directorsDocuments]
    .filter(document => document?.decision?.status === 'revision')
    .map(document => {
      return {
        workflowId,
        workflowState,
        documentId: document?.id as string,
        eventName: CommonWorkflowEvent.REVISION,
        token,
      };
    });
};
