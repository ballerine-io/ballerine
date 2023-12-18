import { useCallback, useMemo } from 'react';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { omitPropsFromObject } from '../useEntity/utils';
import { useCaseDecision } from '../../components/Case/hooks/useCaseDecision/useCaseDecision';
import { selectDirectorsDocuments } from './selectors/selectDirectorsDocuments';
import { useDocumentPageImages } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentPageImages';
import { useDirectorsBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsBlocks';
import {
  motionProps,
  useAssociatedCompaniesBlock,
} from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useAssociatedCompaniesInformationBlock } from '@/pages/Entity/hooks/useTasks/hooks/useAssociatedCompaniesInformationBlock/useAssociatedCompaniesInformationBlock';
import { useDocumentBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentBlocks/useDocumentBlocks';
import { useEntityInfoBlock } from '@/pages/Entity/hooks/useTasks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useMapBlock } from '@/pages/Entity/hooks/useTasks/hooks/useMapBlock/useMapBlock';
import { useRegistryInfoBlock } from '@/pages/Entity/hooks/useTasks/hooks/useRegistryInfoBlock/useRegistryInfoBlock';
import { useKybRegistryInfoBlock } from '@/pages/Entity/hooks/useTasks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useStoreInfoBlock } from '@/pages/Entity/hooks/useTasks/hooks/useStoreInfoBlock/useStoreInfoBlock';
import { useWebsiteBasicRequirementBlock } from '@/pages/Entity/hooks/useTasks/hooks/useWebsiteBasicRequirementBlock/useWebsiteBasicRequirementBlock';
import { useBankingDetailsBlock } from '@/pages/Entity/hooks/useTasks/hooks/useBankingDetailsBlock/useBankingDetailsBlock';
import { useProcessingDetailsBlock } from '@/pages/Entity/hooks/useTasks/hooks/useProcessingDetailsBlock/useProcessingDetailsBlock';
import { useMainRepresentativeBlock } from '@/pages/Entity/hooks/useTasks/hooks/useMainRepresentativeBlock/useMainRepresentativeBlock';
import { useMainContactBlock } from '@/pages/Entity/hooks/useTasks/hooks/useMainContactBlock/useMainContactBlock';
import { useCompanySanctionsBlock } from '@/pages/Entity/hooks/useTasks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useUbosBlock } from '@/pages/Entity/hooks/useTasks/hooks/useUbosBlock/useUbosBlock';
import { useDirectorsRegistryProvidedBlock } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsRegistryProvidedBlock/useDirectorsRegistryProvidedBlock';
import { useDirectorsUserProvidedBlock } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsUserProvidedBlock/useDirectorsUserProvidedBlock';
import { useWebsiteMonitoringBlock } from '@/pages/Entity/hooks/useTasks/hooks/useWebsiteMonitoringBlock/useWebsiteMonitoringBlock';
import { associatedCompanyAdapter } from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/associated-company-adapter';
import { Send } from 'lucide-react';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { getPostDecisionEventName } from '@/pages/Entity/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import toast from 'react-hot-toast';

const pluginsOutputBlacklist = [
  'companySanctions',
  'directors',
  'ubo',
  'businessInformation',
  'website_monitoring',
];

export const useTasks = ({
  workflow,
  entity,
  pluginsOutput,
  documents,
  parentMachine,
}: {
  workflow: TWorkflowById;
  entity: TWorkflowById['context']['entity'];
  pluginsOutput: TWorkflowById['context']['pluginsOutput'];
  documents: TWorkflowById['context']['documents'];
  parentMachine: TWorkflowById['context']['parentMachine'];
}) => {
  const {
    store,
    bank: bankDetails,
    directors: directorsUserProvided = [],
    mainRepresentative,
    mainContact,
    openCorporate: _openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};
  const { website: websiteBasicRequirement, processingDetails, ...storeInfo } = store ?? {};
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { noAction } = useCaseDecision();

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

  const filteredPluginsOutput = useMemo(
    () => omitPropsFromObject(pluginsOutput, ...pluginsOutputBlacklist),
    [pluginsOutput],
  );
  const pluginsOutputKeys = Object.keys(filteredPluginsOutput ?? {});

  const companySanctions = pluginsOutput?.companySanctions?.data?.map(sanction => ({
    sources: sanction?.entity?.sources,
    officialLists: sanction?.entity?.officialLists,
    fullReport: sanction,
    linkedIndividuals: sanction?.entity?.linkedIndividuals,
    lastReviewed: sanction?.entity?.lastReviewed,
    primaryName: sanction?.entity?.name,
    labels: sanction?.entity?.categories,
    reasonsForMatch: sanction?.matchedFields,
    furtherInformation: sanction?.entity?.furtherInformation,
    alternativeNames: sanction?.entity?.otherNames,
    places: sanction?.entity?.places,
  }));
  const ubos = pluginsOutput?.ubo?.data?.uboGraph?.map(ubo => ({
    name: ubo?.name,
    percentage: ubo?.shareHolders?.[0]?.sharePercentage,
    type: ubo?.type,
    level: ubo?.level,
  }));
  const directorsRegistryProvided = pluginsOutput?.directors?.data?.map(({ name, position }) => ({
    name,
    position,
  }));

  const registryInfoBlock = useRegistryInfoBlock({
    pluginsOutputKeys,
    filteredPluginsOutput,
    workflow,
  });

  const kybRegistryInfoBlock = useKybRegistryInfoBlock({
    pluginsOutput,
    workflow,
  });

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
      },
    [mutateRevisionTaskById],
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
      },
    [mutateRevisionTaskById],
  );

  const isWorkflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';
  const parentDocumentBlocks = useDocumentBlocks({
    workflow,
    parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: false,
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

  const entityInfoBlock = useEntityInfoBlock({
    entity,
    entityDataAdditionalInfo,
    workflow,
  });

  const mapBlock = useMapBlock({
    filteredPluginsOutput,
    entityType: entity?.type,
    workflow,
  });

  const storeInfoBlock = useStoreInfoBlock({
    storeInfo,
    workflow,
  });

  const websiteBasicRequirementBlock = useWebsiteBasicRequirementBlock({
    websiteBasicRequirement,
    workflow,
  });

  const bankingDetailsBlock = useBankingDetailsBlock({
    bankDetails,
    workflow,
  });

  const processingDetailsBlock = useProcessingDetailsBlock({
    processingDetails,
    workflow,
  });

  const mainRepresentativeBlock = useMainRepresentativeBlock({
    mainRepresentative,
    workflow,
  });

  const mainContactBlock = useMainContactBlock({
    mainContact,
    workflow,
  });

  const companySanctionsBlock = useCompanySanctionsBlock(companySanctions);

  const ubosBlock = useUbosBlock(ubos);

  const directorsUserProvidedBlock = useDirectorsUserProvidedBlock(directorsUserProvided);

  const directorsDocumentsBlocks = useDirectorsBlocks({
    workflow,
    documentFiles: directorsStorageFilesQueryResult,
    documentImages: directorsDocumentPagesResults,
    onReuploadNeeded: onReuploadNeededDirectors,
    isLoadingReuploadNeeded,
  });

  const directorsRegistryProvidedBlock =
    useDirectorsRegistryProvidedBlock(directorsRegistryProvided);

  const websiteMonitoringBlock = useWebsiteMonitoringBlock({
    pluginsOutput,
    workflow,
  });
  const { mutate: mutateEvent, isLoading: isLoadingEvent } = useEventMutation();
  const onClose = useCallback(
    (associatedCompany: ReturnType<typeof associatedCompanyAdapter>) => () => {
      mutateEvent({
        workflowId: associatedCompany?.workflowId,
        event: 'START_ASSOCIATED_COMPANY_KYB',
      });
    },
    [mutateEvent],
  );
  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );
  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: kybChildWorkflows,
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
          By clicking the button below, an email with a link will be sent to{' '}
          {associatedCompany.companyName} &apos;s contact person, {associatedCompany.contactPerson},
          directing them to provide information about their company. The case status will then
          change to &ldquo;Collection in Progress&ldquo; until the contact person will provide the
          needed information.
        </p>
      ),
      Close: ({ associatedCompany }) => (
        <Button
          className={ctw(`gap-x-2`, {
            loading: isLoadingEvent,
          })}
          onClick={onClose(associatedCompany)}
        >
          <Send size={18} />
          Send email
        </Button>
      ),
    },
  });

  const associatedCompaniesInformationBlock = useAssociatedCompaniesInformationBlock(
    kybChildWorkflows ?? [],
  );

  return useMemo(() => {
    return entity
      ? [
          ...websiteMonitoringBlock,
          ...entityInfoBlock,
          ...registryInfoBlock,
          ...kybRegistryInfoBlock,
          ...companySanctionsBlock,
          ...directorsUserProvidedBlock,
          ...directorsRegistryProvidedBlock,
          ...directorsDocumentsBlocks,
          ...ubosBlock,
          ...storeInfoBlock,
          ...websiteBasicRequirementBlock,
          ...bankingDetailsBlock,
          ...processingDetailsBlock,
          ...mainContactBlock,
          ...mainRepresentativeBlock,
          ...mapBlock,
          ...parentDocumentBlocks,
          ...associatedCompaniesBlock,
          ...associatedCompaniesInformationBlock,
        ]
      : [];
  }, [
    entity,
    websiteMonitoringBlock,
    entityInfoBlock,
    registryInfoBlock,
    kybRegistryInfoBlock,
    companySanctionsBlock,
    directorsUserProvidedBlock,
    directorsRegistryProvidedBlock,
    directorsDocumentsBlocks,
    ubosBlock,
    storeInfoBlock,
    websiteBasicRequirementBlock,
    bankingDetailsBlock,
    processingDetailsBlock,
    mainContactBlock,
    mainRepresentativeBlock,
    mapBlock,
    parentDocumentBlocks,
    associatedCompaniesBlock,
    associatedCompaniesInformationBlock,
  ]);
};
