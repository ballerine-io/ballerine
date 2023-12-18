import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useEntityInfoBlock } from '@/pages/Entity/hooks/useTasks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useDocumentBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentBlocks/useDocumentBlocks';
import { BlocksComponent } from '@/lib/blocks/components/BlocksComponent/BlocksComponent';
import { useMainRepresentativeBlock } from '@/pages/Entity/hooks/useTasks/hooks/useMainRepresentativeBlock/useMainRepresentativeBlock';
import { useDirectorsBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsBlocks';
import { useCallback, useMemo } from 'react';
import { selectDirectorsDocuments } from '@/pages/Entity/hooks/useTasks/selectors/selectDirectorsDocuments';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useDocumentPageImages } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentPageImages';
import {
  motionProps,
  useAssociatedCompaniesBlock,
} from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useDirectorsRegistryProvidedBlock } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsRegistryProvidedBlock/useDirectorsRegistryProvidedBlock';
import { useAssociatedCompaniesInformationBlock } from '@/pages/Entity/hooks/useTasks/hooks/useAssociatedCompaniesInformationBlock/useAssociatedCompaniesInformationBlock';
import { useDirectorsUserProvidedBlock } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsUserProvidedBlock/useDirectorsUserProvidedBlock';
import { associatedCompanyAdapter } from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/associated-company-adapter';
import { Button } from '@/common/components/atoms/Button/Button';
import { ctw } from '@/common/utils/ctw/ctw';
import { ExternalLink, Send } from 'lucide-react';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { ChildDocumentBlocks } from '@/pages/Entity/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { getPostDecisionEventName } from '@/pages/Entity/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import toast from 'react-hot-toast';

export const KybDemoBlocks = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({
    workflowId: workflowId ?? '',
    filterId: filterId ?? '',
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
  const directorsRegistryProvided = useMemo(() => {
    return workflow?.context?.pluginsOutput?.directors?.data?.map(({ name, position }) => ({
      name,
      position,
    }));
  }, [workflow?.context?.pluginsOutput?.directors?.data]);
  const directorsDocuments = useMemo(() => selectDirectorsDocuments(workflow), [workflow]);
  const directorDocumentPages = useMemo(
    () =>
      directorsDocuments.flatMap(({ pages }) =>
        pages?.map(({ ballerineFileId }) => ballerineFileId),
      ),
    [directorsDocuments],
  );
  const directorsStorageFilesQueryResult = useStorageFilesQuery(directorDocumentPages);
  const directorsDocumentPagesResults: Array<Array<string>> = useDocumentPageImages(
    directorsDocuments,
    directorsStorageFilesQueryResult,
  );

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
  const postDecisionEventName = getPostDecisionEventName(workflow);
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingReuploadNeeded } =
    useRevisionTaskByIdMutation(postDecisionEventName);
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
        window.open(workflow?.context?.metadata?.collectionFlowUrl, '_blank');
      },
    [mutateRevisionTaskById, workflow?.context?.metadata?.collectionFlowUrl],
  );
  const onReuploadNeededDirectors = useCallback(
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
          contextUpdateMethod: 'director',
        });
        window.open(workflow?.context?.metadata?.collectionFlowUrl, '_blank');
      },
    [mutateRevisionTaskById, workflow?.context?.metadata?.collectionFlowUrl],
  );

  // Blocks
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
    // TODO - Remove `CallToActionLegacy` and revisit this object.
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
  const mainRepresentativeBlock = useMainRepresentativeBlock({
    workflow,
    mainRepresentative,
  });

  const directorsRegistryProvidedBlock =
    useDirectorsRegistryProvidedBlock(directorsRegistryProvided);
  const directorsUserProvidedBlock = useDirectorsUserProvidedBlock(directorsUserProvided);
  const directorsBlock = useDirectorsBlocks({
    workflow,
    documentFiles: directorsStorageFilesQueryResult,
    documentImages: directorsDocumentPagesResults,
    onReuploadNeeded: onReuploadNeededDirectors,
    isLoadingReuploadNeeded,
  });

  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );
  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: kybChildWorkflows ?? [],
    onClose,
    isLoadingOnClose: isLoadingEvent,
    dialog: {
      Trigger: props => (
        <MotionButton {...motionProps} variant="outline" className={'ms-3.5'} {...props}>
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
  });
  const associatedCompaniesInformationBlock = useAssociatedCompaniesInformationBlock(
    kybChildWorkflows ?? [],
  );
  // /Blocks

  const blocks = [
    ...businessInformation,
    ...mainRepresentativeBlock,
    ...documentsBlocks,
    ...directorsRegistryProvidedBlock,
    ...directorsUserProvidedBlock,
    ...directorsBlock,
    ...associatedCompaniesBlock,
    ...associatedCompaniesInformationBlock,
  ];

  return (
    <>
      <BlocksComponent blocks={blocks} />
      {kybChildWorkflows?.map(childWorkflow => (
        <ChildDocumentBlocks
          parentWorkflowId={workflow?.id}
          childWorkflow={childWorkflow}
          parentMachine={workflow?.context?.parentMachine}
          key={childWorkflow?.id}
          onReuploadNeeded={onReuploadNeeded}
          isLoadingReuploadNeeded={isLoadingReuploadNeeded}
        />
      ))}
    </>
  );
};
