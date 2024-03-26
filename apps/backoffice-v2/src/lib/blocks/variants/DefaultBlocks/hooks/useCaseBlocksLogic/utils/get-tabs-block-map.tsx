import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createAssociatedCompanyDocumentBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-assosiacted-company-document-blocks';
import { createKycBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-kyc-blocks';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: any;
  isLoadingReuploadNeeded: boolean;
};

export const getTabsToBlocksMap = (
  blocks: any[],
  blocksCreationParams: TCaseBlocksCreationProps,
  theme?: WorkflowDefinitionConfigTheme,
) => {
  const { workflow } = blocksCreationParams;

  const [
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
  ] = blocks;

  const defaultTabsMap = {
    summary: [...processTrackerBlock, ...websiteMonitoringBlock, ...entityInfoBlock],
    company_information: [
      ...registryInfoBlock,
      ...kybRegistryInfoBlock,
      ...companySanctionsBlock,
      ...bankingDetailsBlock,
    ],
    store_info: [...storeInfoBlock, ...processingDetailsBlock, ...websiteBasicRequirementBlock],
    documents: [...parentDocumentBlocks, ...directorsDocumentsBlocks],
    ubos: [
      ...ubosUserProvidedBlock,
      ...ubosRegistryProvidedBlock,
      ...(createKycBlocks(workflow as TWorkflowById) || []),
    ],
    associated_companies: [
      ...associatedCompaniesBlock,
      ...associatedCompaniesInformationBlock,
      ...createKycBlocks(workflow as TWorkflowById),
      ...createAssociatedCompanyDocumentBlocks(workflow, blocksCreationParams),
    ],
    directors: [
      ...directorsUserProvidedBlock,
      ...directorsRegistryProvidedBlock,
      ...(createKycBlocks(workflow as TWorkflowById) || []),
    ],
    website_monitoring: [...websiteMonitoringBlocks],
  };

  if (theme?.type === 'kyb') {
    return defaultTabsMap;
  }

  if (theme?.type === 'documents-review') {
    return {
      documents: [...documentReviewBlocks],
    };
  }

  if (theme?.type === 'kyc') {
    return {
      kyc: [...businessInformationBlocks, ...createKycBlocks(workflow)],
    };
  }

  return defaultTabsMap;
};
