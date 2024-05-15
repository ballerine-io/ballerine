import { Button } from '@/common/components/atoms/Button/Button';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';
import { ctw } from '@/common/utils/ctw/ctw';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useAssociatedCompaniesInformationBlock } from '@/lib/blocks/hooks/useAssociatedCompaniesInformationBlock/useAssociatedCompaniesInformationBlock';
import { associatedCompanyAdapter } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/associated-company-adapter';
import {
  motionButtonProps,
  useAssociatedCompaniesBlock,
} from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useBankingDetailsBlock } from '@/lib/blocks/hooks/useBankingDetailsBlock/useBankingDetailsBlock';
import { useCaseInfoBlock } from '@/lib/blocks/hooks/useCaseInfoBlock/useCaseInfoBlock';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useDirectorsBlocks } from '@/lib/blocks/hooks/useDirectorsBlocks';
import { useDirectorsRegistryProvidedBlock } from '@/lib/blocks/hooks/useDirectorsRegistryProvidedBlock/useDirectorsRegistryProvidedBlock';
import { useDirectorsUserProvidedBlock } from '@/lib/blocks/hooks/useDirectorsUserProvidedBlock/useDirectorsUserProvidedBlock';
import { useDocumentBlocks } from '@/lib/blocks/hooks/useDocumentBlocks/useDocumentBlocks';
import { useDocumentPageImages } from '@/lib/blocks/hooks/useDocumentPageImages';
import { useDocumentReviewBlocks } from '@/lib/blocks/hooks/useDocumentReviewBlocks/useDocumentReviewBlocks';
import { useKYCBusinessInformationBlock } from '@/lib/blocks/hooks/useKYCBusinessInformationBlock/useKYCBusinessInformationBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useMainContactBlock } from '@/lib/blocks/hooks/useMainContactBlock/useMainContactBlock';
import { useMainRepresentativeBlock } from '@/lib/blocks/hooks/useMainRepresentativeBlock/useMainRepresentativeBlock';
import { useMapBlock } from '@/lib/blocks/hooks/useMapBlock/useMapBlock';
import { useProcessTrackerBlock } from '@/lib/blocks/hooks/useProcessTrackerBlock/useProcessTrackerBlock';
import { useProcessingDetailsBlock } from '@/lib/blocks/hooks/useProcessingDetailsBlock/useProcessingDetailsBlock';
import { useRegistryInfoBlock } from '@/lib/blocks/hooks/useRegistryInfoBlock/useRegistryInfoBlock';
import { useStoreInfoBlock } from '@/lib/blocks/hooks/useStoreInfoBlock/useStoreInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';
import { useUbosUserProvidedBlock } from '@/lib/blocks/hooks/useUbosUserProvidedBlock/useUbosUserProvidedBlock';
import { useWebsiteBasicRequirementBlock } from '@/lib/blocks/hooks/useWebsiteBasicRequirementBlock/useWebsiteBasicRequirementBlock';
import { useWebsiteMonitoringBlock } from '@/lib/blocks/hooks/useWebsiteMonitoringBlock/useWebsiteMonitoringBlock';
import { useCaseBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/useCaseBlocks';
import { useWebsiteMonitoringReportBlock } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringReportBlock/useWebsiteMonitoringReportBlock';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { selectDirectorsDocuments } from '@/pages/Entity/selectors/selectDirectorsDocuments';
import { Send } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const pluginsOutputBlacklist = [
  'companySanctions',
  'directors',
  'ubo',
  'businessInformation',
  'website_monitoring',
] as const;

export const useDefaultBlocksLogic = () => {
  const { data: workflow, isLoading } = useCurrentCaseQuery();
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { noAction } = useCaseDecision();
  const isWorkflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';
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
  const {
    store,
    bank: bankDetails,
    ubos: ubosUserProvided = [],
    directors: directorsUserProvided = [],
    mainRepresentative,
    mainContact,
    openCorporate: _openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};
  const { website: websiteBasicRequirement, processingDetails, ...storeInfo } = store ?? {};
  const kycChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
  );
  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );

  const filteredPluginsOutput = useMemo(
    () => omitPropsFromObject(workflow?.context?.pluginsOutput, ...pluginsOutputBlacklist),
    [pluginsOutputBlacklist, workflow?.context?.pluginsOutput],
  );

  const pluginsOutputKeys = Object.keys(filteredPluginsOutput ?? {});
  const directorsDocuments = useMemo(() => selectDirectorsDocuments(workflow), [workflow]);
  const directorDocumentPages = useMemo(
    () =>
      directorsDocuments.flatMap(({ pages }) =>
        pages?.map(({ ballerineFileId }) => ballerineFileId),
      ),
    [directorsDocuments],
  );

  const directorsStorageFilesQueryResult = useStorageFilesQuery(directorDocumentPages);
  const directorsDocumentPagesResults: string[][] = useDocumentPageImages(
    directorsDocuments,
    directorsStorageFilesQueryResult,
  );

  const companySanctions = useMemo(() => {
    const sanctions = workflow?.context?.pluginsOutput?.companySanctions?.data?.map(sanction => ({
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

    const checkDate = workflow?.context?.pluginsOutput?.companySanctions?.invokedAt;

    return {
      sanctions,
      checkDate,
    };
  }, [workflow?.context?.pluginsOutput?.companySanctions]);

  const ubosRegistryProvided = workflow?.context?.pluginsOutput?.ubo?.data?.uboGraph?.map(ubo => ({
    name: ubo?.name,
    percentage: ubo?.shareHolders?.[0]?.sharePercentage,
    type: ubo?.type,
    level: ubo?.level,
  }));

  const directorsRegistryProvided = workflow?.context?.pluginsOutput?.directors?.data?.map(
    ({ name, position }) => ({
      name,
      position,
    }),
  );

  const registryInfoBlock = useRegistryInfoBlock({
    pluginsOutputKeys,
    filteredPluginsOutput,
    workflow,
  });

  const kybRegistryInfoBlock = useKybRegistryInfoBlock({
    pluginsOutput: workflow?.context?.pluginsOutput,
    workflow,
  });

  const parentDocumentBlocks = useDocumentBlocks({
    workflow,
    parentMachine: workflow?.context?.parentMachine,
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

  const entityInfoBlock = useCaseInfoBlock({
    entity: workflow?.context?.entity,
    entityDataAdditionalInfo,
    workflow,
  });

  const mapBlock = useMapBlock({
    filteredPluginsOutput,
    entityType: workflow?.context?.entity?.type,
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

  const ubosUserProvidedBlock = useUbosUserProvidedBlock(ubosUserProvided);

  const ubosRegistryProvidedBlock = useUbosRegistryProvidedBlock(
    ubosRegistryProvided,
    workflow?.context?.pluginsOutput?.ubo?.message,
    workflow?.context?.pluginsOutput?.ubo?.isRequestTimedOut,
  );

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
    pluginsOutput: workflow?.context?.pluginsOutput,
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

  const plugins = useCasePlugins({ workflow });
  const processTrackerBlock = useProcessTrackerBlock({
    workflow,
    plugins,
    processes: DEFAULT_PROCESS_TRACKER_PROCESSES,
  });

  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: kybChildWorkflows,
    onClose,
    isLoadingOnClose: isLoadingEvent,
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
    isAssociatedCompanyKybEnabled:
      !!workflow?.workflowDefinition?.config?.isAssociatedCompanyKybEnabled,
  });

  const associatedCompaniesInformationBlock = useAssociatedCompaniesInformationBlock(
    kybChildWorkflows ?? [],
  );

  const websiteMonitoringBlocks = useWebsiteMonitoringReportBlock();
  const documentReviewBlocks = useDocumentReviewBlocks();
  const businessInformationBlocks = useKYCBusinessInformationBlock();

  const allBlocks = useMemo(() => {
    if (!workflow?.context?.entity) return [];

    return [
      websiteMonitoringBlock,
      entityInfoBlock,
      registryInfoBlock,
      kybRegistryInfoBlock,
      companySanctionsBlock,
      ubosUserProvidedBlock,
      ubosRegistryProvidedBlock,
      directorsUserProvidedBlock,
      directorsRegistryProvidedBlock,
      directorsDocumentsBlocks,
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
      processTrackerBlock,
      websiteMonitoringBlocks,
      documentReviewBlocks,
      businessInformationBlocks,
    ];
  }, [
    associatedCompaniesBlock,
    associatedCompaniesInformationBlock,
    bankingDetailsBlock,
    companySanctionsBlock,
    directorsDocumentsBlocks,
    directorsRegistryProvidedBlock,
    directorsUserProvidedBlock,
    entityInfoBlock,
    kybRegistryInfoBlock,
    mainContactBlock,
    mainRepresentativeBlock,
    mapBlock,
    parentDocumentBlocks,
    processingDetailsBlock,
    registryInfoBlock,
    storeInfoBlock,
    ubosUserProvidedBlock,
    ubosRegistryProvidedBlock,
    websiteBasicRequirementBlock,
    websiteMonitoringBlock,
    processTrackerBlock,
    websiteMonitoringBlocks,
    documentReviewBlocks,
    businessInformationBlocks,
    workflow?.context?.entity,
  ]);

  const {
    activeTab,
    blocks = [],
    tabs,
    setActiveTab,
  } = useCaseBlocks({
    workflow,
    config: workflow?.workflowDefinition?.config,
    blocks: allBlocks,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
  });

  const availableTabs = useMemo(() => tabs.filter(tab => !tab.hidden), [tabs]);

  return {
    blocks,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    isLoading,
    activeTab,
    tabs: availableTabs,
    setActiveTab,
  };
};
