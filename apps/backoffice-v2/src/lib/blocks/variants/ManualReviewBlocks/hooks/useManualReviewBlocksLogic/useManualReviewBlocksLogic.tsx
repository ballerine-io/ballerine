import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useDocumentBlocks } from '@/lib/blocks/hooks/useDocumentBlocks/useDocumentBlocks';
import { useEntityInfoBlock } from '@/lib/blocks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useManualReviewBlocksLogic = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow, isLoading } = useWorkflowByIdQuery({
    workflowId: workflowId ?? '',
    filterId: filterId ?? '',
  });
  const { noAction } = useCaseDecision();
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);
  const {
    store: _store,
    bank: _bank,
    directors: _directors,
    mainRepresentative: _mainRepresentative,
    mainContact: _mainContact,
    openCorporate: _openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingReuploadNeeded } =
    useRevisionTaskByIdMutation();
  const onReuploadNeeded = useCallback(
    ({
        workflowId,
        documentId,
        reason,
      }: Pick<
        Parameters<typeof mutateRevisionTaskById>[0],
        'workflowId' | 'documentId' | 'reason'
      >) =>
      () => {
        if (!documentId) {
          toast.error('Invalid task id');

          return;
        }

        mutateRevisionTaskById({
          workflowId,
          documentId,
          reason,
          contextUpdateMethod: 'base',
        });
      },
    [mutateRevisionTaskById],
  );

  const businessInformation = useEntityInfoBlock({
    entity: workflow?.context?.entity ?? {},
    workflow,
    entityDataAdditionalInfo,
  });
  const isWorkflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';
  const documentsBlocks = useDocumentBlocks({
    workflow,
    parentMachine: workflow?.context?.parentMachine,
    noAction,
    withEntityNameInHeader: false,
    caseState,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    dialog: {
      reupload: {
        Description: () => (
          <p className="text-sm">
            {isWorkflowLevelResolution && (
              <>
                Once marked, you can use the “Ask for all re-uploads” button at the top of the
                screen to initiate a request for the customer to re-upload all of the documents you
                have marked for re-upload.
              </>
            )}
            {!isWorkflowLevelResolution && (
              <>
                <span className="mb-[10px] block">
                  By clicking the button below, an email with a link will be sent to the customer,
                  directing them to re-upload the documents you have marked as “re-upload needed”.
                </span>
                <span>
                  The case’s status will then change to “Revisions” until the customer will provide
                  the needed documents and fixes.
                </span>
              </>
            )}
          </p>
        ),
      },
    },
  });
  const blocks = useMemo(() => {
    return [...businessInformation, ...documentsBlocks];
  }, [businessInformation, documentsBlocks]);

  return {
    blocks,
    isLoading,
  };
};
