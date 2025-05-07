import { Button } from '@/common/components/atoms/Button/Button';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { ctw } from '@/common/utils/ctw/ctw';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useApproveDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useApproveDocumentByIdMutation/useApproveDocumentByIdMutation';
import { useRemoveDocumentDecisionByIdMutation } from '@/domains/documents/hooks/mutations/useRemoveDocumentDecisionByIdMutation/useRemoveDocumentDecisionByIdMutation';
import { useReviseDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useReviseDocumentByIdMutation/useReviseDocumentByIdMutation';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRemoveTaskDecisionByIdMutation } from '@/domains/entities/hooks/mutations/useRemoveTaskDecisionByIdMutation/useRemoveTaskDecisionByIdMutation';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { createDirectorsBlocks } from '@/lib/blocks/components/DirectorBlock/hooks/useDirectorBlock/create-directors-blocks';
import { directorAdapter } from '@/lib/blocks/components/DirectorBlock/hooks/useDirectorBlock/helpers';
import { useAssociatedCompaniesInformationBlock } from '@/lib/blocks/hooks/useAssociatedCompaniesInformationBlock/useAssociatedCompaniesInformationBlock';
import { associatedCompanyAdapter } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/associated-company-adapter';
import { associatedCompanyToWorkflowAdapter } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/associated-company-to-workflow-adapter';
import {
  motionButtonProps,
  useAssociatedCompaniesBlock,
} from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useDocumentBlocks } from '@/lib/blocks/hooks/useDocumentBlocks/useDocumentBlocks';
import { useEntityInfoBlock } from '@/lib/blocks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useMainRepresentativeBlock } from '@/lib/blocks/hooks/useMainRepresentativeBlock/useMainRepresentativeBlock';
import { useEditCollectionFlow } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow/useEditCollectionFlow';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { buildCollectionFlowUrl, StateTag } from '@ballerine/common';
import { ExternalLink, Send } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useKybExampleBlocksLogic = () => {
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
    directors: directorsUserProvided = [],
    mainRepresentative,
    mainContact: _mainContact,
    openCorporate: _openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};

  const { mutate: mutateEvent, isLoading: isLoadingEvent } = useEventMutation();
  const onClose = useCallback(
    (associatedCompany: ReturnType<typeof associatedCompanyAdapter>) => () => {
      mutateEvent({
        workflowId: associatedCompany?.workflowId,
        event: 'START_ASSOCIATED_COMPANY_KYB',
      });
      window.open(associatedCompany?.collectionFlowUrl, '_blank');
    },
    [mutateEvent],
  );
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingReuploadNeeded } =
    useRevisionTaskByIdMutation();
  const { mutate: mutateReviseDocumentById, isLoading: isLoadingReviseDocumentById } =
    useReviseDocumentByIdMutation();
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

        if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateReviseDocumentById({
            documentId,
            decisionReason: reason,
          });
        }

        if (!workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateRevisionTaskById({
            workflowId,
            documentId,
            reason,
            contextUpdateMethod: 'base',
          });
        }
      },
    [
      workflow?.workflowDefinition?.config?.isDocumentsV2,
      mutateReviseDocumentById,
      mutateRevisionTaskById,
    ],
  );

  // Blocks
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
    isLoadingReuploadNeeded: isLoadingReuploadNeeded || isLoadingReviseDocumentById,
    // TODO - Remove `CallToActionLegacy` and revisit this object.
    dialog: {
      reupload: {
        Description: () => (
          <p className="text-sm">
            {isWorkflowLevelResolution && (
              <>
                After selecting one or more documents for re-upload, click ‘Ask for all re-uploads’
                at the top of the case. This action will open a new tab to simulate the document
                re-upload request process. Note: In the live environment, requests for document
                re-uploads are initiated via email to the company’s representative.
              </>
            )}
            {!isWorkflowLevelResolution && (
              <>
                <span className="mb-[10px] block">
                  Click the button below to simulate a document re-upload request process in a new
                  tab.
                </span>
                <span>
                  Note: In the live environment, requests for document re-uploads are initiated via
                  email to the company’s representative.
                </span>
              </>
            )}
          </p>
        ),
      },
    },
  });
  const mainRepresentativeBlock = useMainRepresentativeBlock({
    workflow,
    mainRepresentative,
  });

  const { mutate: mutateRemoveTaskDecisionById } = useRemoveTaskDecisionByIdMutation(workflow?.id);
  const {
    mutate: mutateRemoveDocumentDecisionById,
    isLoading: isLoadingRemoveDocumentDecisionById,
  } = useRemoveDocumentDecisionByIdMutation(workflow?.id);
  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const { mutate: mutateApproveDocumentById, isLoading: isLoadingApproveDocumentById } =
    useApproveDocumentByIdMutation(workflow?.id);

  const onMutateRevisionTaskByIdDirectors = useCallback(
    ({
        directorId,
        workflowId,
        documentId,
        reason,
      }: Pick<
        Parameters<typeof mutateRevisionTaskById>[0],
        'directorId' | 'workflowId' | 'documentId' | 'reason'
      >) =>
      () => {
        if (!documentId) {
          toast.error('Invalid task id');

          return;
        }

        if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateReviseDocumentById({
            documentId,
            decisionReason: reason,
          });
        }

        if (!workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateRevisionTaskById({
            directorId,
            workflowId,
            documentId,
            reason,
            contextUpdateMethod: 'director',
          });
        }

        const url = buildCollectionFlowUrl(workflow?.context?.metadata?.collectionFlowUrl, {
          workflowId: workflow?.id,
          token: workflow?.context?.metadata?.token,
        });

        window.open(url, '_blank');
      },
    [
      mutateReviseDocumentById,
      mutateRevisionTaskById,
      workflow?.id,
      workflow?.context?.metadata?.token,
      workflow?.context?.metadata?.collectionFlowUrl,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );
  const onMutateApproveTaskByIdDirectors = useCallback(
    ({ directorId, documentId }: { directorId: string; documentId: string }) => {
      if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
        mutateApproveDocumentById({ documentId });

        return;
      }

      mutateApproveTaskById({ directorId, documentId, contextUpdateMethod: 'director' });
    },
    [
      mutateApproveDocumentById,
      mutateApproveTaskById,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );
  const onMutateRemoveTaskDecisionByIdDirectors = useCallback(
    ({ directorId, documentId }: { directorId: string; documentId: string }) => {
      if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
        mutateRemoveDocumentDecisionById({ documentId });

        return;
      }

      mutateRemoveTaskDecisionById({ directorId, documentId, contextUpdateMethod: 'director' });
    },
    [
      mutateRemoveTaskDecisionById,
      mutateRemoveDocumentDecisionById,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );

  const directors =
    workflow?.context?.entity?.data?.additionalInfo?.directors?.map(directorAdapter);
  const revisionReasons =
    workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum ?? [];

  const directorsBlock = createDirectorsBlocks({
    workflowId: workflow?.id ?? '',
    onReuploadNeeded: onMutateRevisionTaskByIdDirectors,
    onRemoveDecision: onMutateRemoveTaskDecisionByIdDirectors,
    onApprove: onMutateApproveTaskByIdDirectors,
    directors,
    tags: workflow?.tags ?? [],
    revisionReasons,
    isEditable: caseState.writeEnabled,
    isApproveDisabled: isLoadingApproveTaskById,
    // Remove once callToActionLegacy is removed
    workflow,
  });

  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );
  const associatedCompanies =
    !kybChildWorkflows?.length &&
    !workflow?.workflowDefinition?.config?.isAssociatedCompanyKybEnabled
      ? workflow?.context?.entity?.data?.additionalInfo?.associatedCompanies?.map(
          associatedCompanyToWorkflowAdapter,
        )
      : kybChildWorkflows;

  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: associatedCompanies ?? [],
    dialog: {
      Trigger: props => (
        <MotionButton
          {...motionButtonProps}
          animate={{
            ...motionButtonProps.animate,
            opacity: !caseState.actionButtonsEnabled ? 0.5 : motionButtonProps.animate.opacity,
          }}
          variant="outline"
          className={'ms-3.5'}
          disabled={!caseState.actionButtonsEnabled}
          {...props}
        >
          Initiate KYB
        </MotionButton>
      ),
      Title: ({ associatedCompany }) => <>Initiate KYB for {associatedCompany.companyName}</>,
      Description: ({ associatedCompany }) => (
        <p className={`text-sm`}>
          Explore our parent KYB Demo. Click the &quot;Open KYB&quot; to launch a simulated KYB
          process for {associatedCompany?.companyName} in a new tab. Note: In the live environment,
          the KYB process begins with an email to {associatedCompany?.companyName}&apos;s
          representative.
        </p>
      ),
      Close: ({ associatedCompany }) => (
        <>
          <Button
            className={ctw(`gap-x-2`, {
              loading: isLoadingEvent,
            })}
            disabled
          >
            <Send size={18} />
            Send email
          </Button>
          <Button
            className={ctw(`gap-x-2`, {
              loading: isLoadingEvent,
            })}
            onClick={onClose(associatedCompany)}
          >
            <ExternalLink size={18} />
            Open KYB
          </Button>
        </>
      ),
    },
    isAssociatedCompanyKybEnabled:
      !!workflow?.workflowDefinition?.config?.isAssociatedCompanyKybEnabled,
  });
  const associatedCompaniesInformationBlock = useAssociatedCompaniesInformationBlock(
    kybChildWorkflows ?? [],
  );
  // /Blocks

  const blocks = useMemo(() => {
    return [
      ...businessInformation,
      ...mainRepresentativeBlock,
      ...documentsBlocks,
      ...directorsBlock,
      ...associatedCompaniesBlock,
      ...associatedCompaniesInformationBlock,
    ];
  }, [
    businessInformation,
    mainRepresentativeBlock,
    documentsBlocks,
    directorsBlock,
    associatedCompaniesBlock,
    associatedCompaniesInformationBlock,
  ]);

  return {
    blocks,
    kybChildWorkflows,
    workflowId: workflow?.id,
    parentMachine: workflow?.context?.parentMachine,
    onReuploadNeeded,
    isLoadingReuploadNeeded: isLoadingReuploadNeeded || isLoadingReviseDocumentById,
    isLoading,
  };
};
