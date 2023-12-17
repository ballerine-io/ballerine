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

  // Blocks
  const businessInformation = useEntityInfoBlock({
    entity: workflow?.context?.entity ?? {},
    workflow,
    entityDataAdditionalInfo,
  });
  const documentsBlocks = useDocumentBlocks({
    workflow,
    parentMachine: workflow?.context?.parentMachine,
    noAction,
    withEntityNameInHeader: false,
    caseState,
  });
  const mainRepresentativeBlock = useMainRepresentativeBlock({
    workflow,
    mainRepresentative,
  });

  const directorsRegistryProvidedBlock =
    useDirectorsRegistryProvidedBlock(directorsRegistryProvided);
  const directorsUserProvidedBlock = useDirectorsUserProvidedBlock(directorsUserProvided);
  const directorsBlock = useDirectorsBlocks(
    workflow,
    directorsStorageFilesQueryResult,
    directorsDocumentPagesResults,
  );

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
          Clicking the button in this local setup opens a demo KYB flow for{' '}
          {associatedCompany?.companyName} in a new tab, rather than sending an email to{' '}
          {associatedCompany?.contactPerson}. Remember, this is only a simulation. In the live
          version, an email initiates the actual KYB process.
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
  console.log(kybChildWorkflows);
  return (
    <>
      <BlocksComponent blocks={blocks} />
      {kybChildWorkflows?.map(childWorkflow => (
        <ChildDocumentBlocks
          parentWorkflowId={workflow?.id}
          childWorkflow={childWorkflow}
          parentMachine={workflow?.context?.parentMachine}
          key={childWorkflow?.id}
        />
      ))}
    </>
  );
};
