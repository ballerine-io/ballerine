import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useEntityInfoBlock } from '@/lib/blocks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useDocumentBlocks } from '@/lib/blocks/hooks/useDocumentBlocks/useDocumentBlocks';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useEditCollectionFlow } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow/useEditCollectionFlow';
import { StateTag, valueOrNA } from '@ballerine/common';
import { useEntityAdditionalInfoBlock } from '@/lib/blocks/hooks/useEntityAdditionalInfoBlock/useEntityAdditionalInfoBlock';
import { useAddressBlock } from '@/lib/blocks/hooks/useAddressBlock/useAddressBlock';
import { titleCase } from 'string-ts';

export const useManualReviewBlocksLogic = () => {
  const { entityId: workflowId } = useParams();
  const { data: workflow, isLoading } = useWorkflowByIdQuery({
    workflowId: workflowId ?? '',
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
    associatedCompanies: _associatedCompanies,
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

  const { onEditCollectionFlow } = useEditCollectionFlow();

  const businessInformation = useEntityInfoBlock({
    entity: workflow?.context?.entity,
    workflow,
    isEditDisabled: [
      !caseState.actionButtonsEnabled,
      !workflow?.tags?.includes(StateTag.MANUAL_REVIEW),
      !workflow?.workflowDefinition?.config?.editableContext?.entityInfo,
    ].some(Boolean),
    onEdit: onEditCollectionFlow({ steps: ['company_details'] }),
  });
  const isWorkflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';
  const { businessDocumentBlocks: documentsBlocks } = useDocumentBlocks({
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

  const entityAdditionalInfoBlock = useEntityAdditionalInfoBlock({
    entity: workflow?.context?.entity,
    workflow,
    predefinedOrder:
      workflow?.workflowDefinition?.config?.uiOptions?.backoffice?.blocks?.businessInformation
        ?.predefinedOrder ?? [],
  });

  const entityAddressBlock = useAddressBlock({
    address: workflow?.context?.entity?.data?.address,
    title: `${valueOrNA(titleCase(workflow?.context?.entity?.type ?? ''))} Address`,
    workflow,
  });

  const blocks = useMemo(() => {
    return [
      ...businessInformation,
      ...entityAdditionalInfoBlock,
      ...entityAddressBlock,
      ...documentsBlocks,
    ];
  }, [businessInformation, documentsBlocks, entityAdditionalInfoBlock, entityAddressBlock]);

  return {
    blocks,
    businessInformationBlock: businessInformation,
    documentsBlocks,
    isLoading,
  };
};
