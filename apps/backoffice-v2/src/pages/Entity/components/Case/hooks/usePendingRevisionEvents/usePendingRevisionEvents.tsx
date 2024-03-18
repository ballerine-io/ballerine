import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCallback, useMemo } from 'react';
import { calculateAllWorkflowPendingEvents } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/utils/calculate-pending-workflow-events';
import { CommonWorkflowEvent, CommonWorkflowStates } from '@ballerine/common';
import { checkIsKybExampleVariant } from '@/lib/blocks/variants/variant-checkers';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { IPendingEvent } from './interfaces';

const composeUniqueWorkflowEvents = (
  acc: Record<string, IPendingEvent>,
  pendingWorkflowEvent: IPendingEvent,
) => {
  acc[`${pendingWorkflowEvent?.workflowId}-${pendingWorkflowEvent?.eventName}`] =
    pendingWorkflowEvent;

  return acc;
};

const isPendingEventIsRevision = (pendingWorkflowEvent: IPendingEvent) =>
  pendingWorkflowEvent?.eventName === CommonWorkflowEvent.REVISION ||
  pendingWorkflowEvent?.workflowState === CommonWorkflowStates.MANUAL_REVIEW;

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
      .filter((pendingWorkflowEvent: IPendingEvent) =>
        isPendingEventIsRevision(pendingWorkflowEvent),
      )
      .reduce(
        (acc: Record<string, IPendingEvent>, pendingWorkflowEvent: IPendingEvent) =>
          composeUniqueWorkflowEvents(acc, pendingWorkflowEvent),
        {},
      );

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
