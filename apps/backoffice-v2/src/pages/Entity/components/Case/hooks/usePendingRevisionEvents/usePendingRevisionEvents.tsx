import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCallback } from 'react';
import { buildCollectionFlowUrl, CommonWorkflowEvent } from '@ballerine/common';
import { checkIsKybExampleVariant } from '@/lib/blocks/variants/variant-checkers';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { toast } from 'sonner';
import { t } from 'i18next';

export const usePendingRevisionEvents = ({
  mutateRevisionCase,
  workflow,
  documentIds,
}: {
  mutateRevisionCase: ReturnType<typeof useRevisionCaseMutation>['mutate'];
  workflow?: TWorkflowById;
  documentIds: string[];
}) => {
  const onMutateRevisionCase = useCallback(() => {
    if (!workflow) {
      console.error('Workflow not found.');
      toast.error(t('toast:common.unexpected_error'));
      return;
    }

    if (!workflow?.nextEvents?.some(nextEvent => nextEvent === CommonWorkflowEvent.REVISION)) {
      console.error('Workflow does not have a revision event.');
      toast.error(t('toast:common.unexpected_error'));
      return;
    }

    if (!documentIds?.length) {
      console.error('No document IDs provided.');
      toast.error(t('toast:common.unexpected_error'));
      return;
    }

    mutateRevisionCase({ workflowId: workflow.id, documentIds });

    const isKybExampleVariant = checkIsKybExampleVariant(workflow?.workflowDefinition);

    if (!isKybExampleVariant) {
      console.error('Workflow is not a KYB example variant.');
      toast.error(t('toast:common.unexpected_error'));
      return;
    }

    window.open(
      buildCollectionFlowUrl(workflow?.context?.metadata?.collectionFlowUrl, {
        workflowId: workflow?.id,
        token: workflow?.context?.metadata?.token,
      }),
    );
  }, [mutateRevisionCase, workflow, documentIds]);

  return { onMutateRevisionCase };
};
