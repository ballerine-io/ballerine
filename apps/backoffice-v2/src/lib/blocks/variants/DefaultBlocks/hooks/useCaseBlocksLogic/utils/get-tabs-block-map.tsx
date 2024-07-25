import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createAssociatedCompanyDocumentBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-assosiacted-company-document-blocks';
import { createKycBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-kyc-blocks';
import { Blocks } from '@ballerine/blocks';
import { WorkflowDefinitionConfigThemeEnum } from '@ballerine/common';
import { Tab } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-tabs';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: (params: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
};

export const getTabsToBlocksMap = ({
  blocks,
  blocksCreationParams,
  theme,
}: {
  blocks: Blocks;
  blocksCreationParams: TCaseBlocksCreationProps;
  theme?: WorkflowDefinitionConfigTheme;
}) => {
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
    addressWithContainerBlock,
    parentDocumentBlocks,
    associatedCompaniesBlock,
    associatedCompaniesInformationBlock,
    websiteMonitoringBlocks,
    documentReviewBlocks,
    businessInformationBlocks,
    caseOverviewBlock,
    amlWithContainerBlock,
  ] = blocks;

  const defaultTabsMap = {
    [Tab.SUMMARY]: [
      ...(blocksCreationParams?.workflow?.workflowDefinition?.config?.isCaseOverviewEnabled
        ? caseOverviewBlock
        : []),
      ...websiteMonitoringBlock,
      ...entityInfoBlock,
    ],
    [Tab.COMPANY_INFORMATION]: [
      ...entityInfoBlock,
      // ...mapBlock,
      ...addressWithContainerBlock,
      ...registryInfoBlock,
      ...kybRegistryInfoBlock,
      ...companySanctionsBlock,
      ...bankingDetailsBlock,
    ],
    [Tab.STORE_INFO]: [
      ...storeInfoBlock,
      ...processingDetailsBlock,
      ...websiteBasicRequirementBlock,
    ],
    [Tab.DOCUMENTS]: [...parentDocumentBlocks, ...directorsDocumentsBlocks],
    [Tab.UBOS]: [
      ...ubosUserProvidedBlock,
      ...ubosRegistryProvidedBlock,
      ...amlWithContainerBlock,
      ...(createKycBlocks(blocksCreationParams?.workflow as TWorkflowById) || []),
    ],
    [Tab.ASSOCIATED_COMPANIES]: [
      ...associatedCompaniesBlock,
      ...associatedCompaniesInformationBlock,
      ...createAssociatedCompanyDocumentBlocks(blocksCreationParams),
    ],
    [Tab.DIRECTORS]: [
      ...directorsUserProvidedBlock,
      ...directorsRegistryProvidedBlock,
      ...directorsDocumentsBlocks,
    ],
    [Tab.MONITORING_REPORTS]: [...websiteMonitoringBlocks],
  } as const;

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYB) {
    return defaultTabsMap;
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.DOCUMENTS_REVIEW) {
    return {
      [Tab.DOCUMENTS]: [...documentReviewBlocks],
    } as const;
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYC) {
    return {
      [Tab.KYC]: [
        ...businessInformationBlocks,
        ...amlWithContainerBlock,
        ...createKycBlocks(blocksCreationParams?.workflow),
      ],
    } as const;
  }

  return defaultTabsMap;
};
