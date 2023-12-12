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
import { useAssociatedCompaniesBlock } from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
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

  const parentDocumentBlocks = useDocumentBlocks({
    workflow,
    parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: false,
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

  const directorsDocumentsBlocks = useDirectorsBlocks(
    workflow,
    directorsStorageFilesQueryResult,
    directorsDocumentPagesResults,
  );

  const directorsRegistryProvidedBlock =
    useDirectorsRegistryProvidedBlock(directorsRegistryProvided);

  const websiteMonitoringBlock = useWebsiteMonitoringBlock({
    pluginsOutput,
    workflow,
  });
  const { mutate: mutateEvent, isLoading: isLoadingEvent } = useEventMutation();
  const onMutateEvent = useCallback(
    ({ workflowId, event }: Parameters<typeof mutateEvent>[0]) =>
      () =>
        mutateEvent({
          workflowId,
          event,
        }),
    [mutateEvent],
  );
  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );
  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: kybChildWorkflows,
    onMutateEvent,
    isLoadingEvent,
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
          // ...kybRegistryInfoBlock,
          // ...companySanctionsBlock,
          // ...directorsUserProvidedBlock,
          // ...directorsRegistryProvidedBlock,
          // ...directorsDocumentsBlocks,
          ...ubosBlock,
          // ...storeInfoBlock,
          // ...websiteBasicRequirementBlock,
          // ...bankingDetailsBlock,
          // ...processingDetailsBlock,
          // ...mainContactBlock,
          // ...mainRepresentativeBlock,
          // ...mapBlock,
          // ...parentDocumentBlocks,
          // ...associatedCompaniesBlock,
          // ...associatedCompaniesInformationBlock,
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
