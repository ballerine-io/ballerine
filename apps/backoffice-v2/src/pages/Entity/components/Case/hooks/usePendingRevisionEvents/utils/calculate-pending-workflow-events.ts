import { TWorkflowById } from '@/domains/workflows/fetchers';
import { StateTag, TDocument } from '@ballerine/common';
import { calculateWorkflowRevisionableEvent } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/utils/calculate-workflow-revisionable-event';
import { IPendingEvent } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/interfaces';

export const calculatePendingWorkflowEvents = (workflow: TWorkflowById): Array<IPendingEvent> => {
  return [
    ...workflow.context.documents,
    ...(workflow.context.entity?.data?.additionalInfo?.directors?.flatMap(
      (director: { additionalInfo: { documents: Array<TDocument> } }) =>
        director?.additionalInfo?.documents,
    ) || []),
  ]
    .flat()
    .filter(document => {
      return (
        !!document?.decision?.status &&
        workflow?.tags?.some((tag: any) =>
          [StateTag.MANUAL_REVIEW, StateTag.PENDING_PROCESS].includes(tag),
        )
      );
    })
    .map(document => {
      return {
        workflowId: workflow.id,
        workflowState: workflow.state,
        documentId: document?.id as string,
        eventName: calculateWorkflowRevisionableEvent(workflow, document?.decision?.status),
        token: workflow?.context?.metadata?.token,
      };
    })
    .filter((a): a is NonNullable<IPendingEvent> => !!a && !!a.eventName);
};

export const calculateAllWorkflowPendingEvents = (workflow: TWorkflowById): IPendingEvent[] => {
  return [
    ...calculatePendingWorkflowEvents(workflow),
    ...(workflow.childWorkflows?.flatMap(childWorkflow =>
      calculateAllWorkflowPendingEvents(childWorkflow),
    ) || []),
  ].flat();
};
