import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createAssociatedCompanyDocumentBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-assosiacted-company-document-blocks';
import { createKycBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-kyc-blocks';
import { Blocks } from '@ballerine/blocks';
import { WorkflowDefinitionConfigThemeEnum } from '@ballerine/common';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: any;
  isLoadingReuploadNeeded: boolean;
};

export const getTabsToBlocksMap = (
  blocks: Blocks[],
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
    summary: [
      ...(workflow?.workflowDefinition?.config?.isCaseOverviewEnabled ? processTrackerBlock : []),
      ...websiteMonitoringBlock,
      ...entityInfoBlock,
    ],
    company_information: [
      ...entityInfoBlock,
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
      ...directorsDocumentsBlocks,
    ],
    website_monitoring: [...websiteMonitoringBlocks],
  } as const;

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYB) {
    return defaultTabsMap;
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.DOCUMENTS_REVIEW) {
    return {
      documents: [...documentReviewBlocks],
    } as const;
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYC) {
    return {
      kyc: [...businessInformationBlocks, ...createKycBlocks(workflow)],
    } as const;
  }

  return defaultTabsMap;
};
