import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCallback } from 'react';
import { buildCollectionFlowUrl, CommonWorkflowEvent } from '@ballerine/common';
import { checkIsKybExampleVariant } from '@/lib/blocks/variants/variant-checkers';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';

export const usePendingRevisionEvents = (
  mutateRevisionCase: ReturnType<typeof useRevisionCaseMutation>['mutate'],
  workflow?: TWorkflowById,
) => {
  const onMutateRevisionCase = useCallback(() => {
    if (!workflow?.nextEvents?.some(nextEvent => nextEvent === CommonWorkflowEvent.REVISION)) {
      return;
    }

    mutateRevisionCase({ workflowId: workflow?.id });

    const isKybExampleVariant = checkIsKybExampleVariant(workflow?.workflowDefinition);

    if (!isKybExampleVariant) {
      return;
    }

    window.open(
      buildCollectionFlowUrl(workflow?.context?.metadata?.collectionFlowUrl, {
        workflowId: workflow?.id,
        token: workflow?.context?.metadata?.token,
      }),
    );
  }, [mutateRevisionCase, workflow]);

  return { onMutateRevisionCase };
};
