import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCallback, useMemo } from 'react';
import { calculateAllWorkflowPendingEvents } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/utils/calculate-pending-workflow-events';
import { CommonWorkflowEvent } from '@ballerine/common';
import { checkIsKybExampleVariant } from '@/lib/blocks/variants/variant-checkers';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { IPendingEvent } from './interfaces';

function composeUniqueWorkflowEvents(
  acc: Record<string, IPendingEvent>,
  pendingWorkflowEvent: IPendingEvent,
) {
  acc[`${pendingWorkflowEvent?.workflowId}-${pendingWorkflowEvent?.pendingEvent}`] =
    pendingWorkflowEvent;

  return acc;
}

function isRevisionEvent(pendingWorkflowEvent: IPendingEvent) {
  return (
    pendingWorkflowEvent?.pendingEvent === CommonWorkflowEvent.REVISION ||
    pendingWorkflowEvent?.pendingEvent === CommonWorkflowEvent.TASK_REVIEWED
  );
}

export const usePendingRevisionEvents = (
  mutateRevisionCase: ReturnType<typeof useRevisionCaseMutation>['mutate'],
  workflow?: TWorkflowById,
) => {
  const pendingWorkflowEvents = useMemo(() => {
    if (!workflow) return;

    return calculateAllWorkflowPendingEvents(workflow);
  }, [workflow]);

  const onMutateRevisionCase = useCallback(() => {
    if (!pendingWorkflowEvents || !workflow) return;

    const uniqueWorkflowEvents = pendingWorkflowEvents
      .filter((pendingWorkflowEvent: IPendingEvent) => isRevisionEvent(pendingWorkflowEvent))
      .reduce((acc: Record<string, IPendingEvent>, pendingWorkflowEvent: IPendingEvent) => {
        return composeUniqueWorkflowEvents(acc, pendingWorkflowEvent);
      }, {});

    Object.keys(uniqueWorkflowEvents).forEach(pendingWorkflowKeys => {
      const pendingWorkflowEvent = uniqueWorkflowEvents[pendingWorkflowKeys];
      mutateRevisionCase({ workflowId: pendingWorkflowEvent!.workflowId });

      const isKybExampleVariant = checkIsKybExampleVariant(workflow.workflowDefinition);
      if (!isKybExampleVariant) return;

      window.open(
        `${workflow?.context?.metadata?.collectionFlowUrl}/?token=${pendingWorkflowEvent?.token}`,
        pendingWorkflowEvent?.token,
      );
    });
  }, [mutateRevisionCase, pendingWorkflowEvents, workflow]);

  return { onMutateRevisionCase, pendingWorkflowEvents };
};
