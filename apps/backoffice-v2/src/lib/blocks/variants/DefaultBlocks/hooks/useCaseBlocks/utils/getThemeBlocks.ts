import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

export const getThemeBlocks = (
  blocks: any[],
  theme: WorkflowDefinitionConfigTheme,
  activeTab?: TCaseTabDefinition,
) => {
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
  ] = blocks;

  if (theme.type === 'kyb' && activeTab) {
    if (activeTab.name === 'summary') {
      return [...processTrackerBlock, ...websiteMonitoringBlock, ...entityInfoBlock];
    }

    if (activeTab.name === 'company_information') {
      return [...registryInfoBlock, ...kybRegistryInfoBlock, ...companySanctionsBlock];
    }

    if (activeTab.name === 'store_info') {
      return [...storeInfoBlock];
    }

    if (activeTab.name === 'documents') {
      return [...parentDocumentBlocks, ...directorsDocumentsBlocks];
    }

    if (activeTab.name === 'individuals') {
      return [
        ...ubosUserProvidedBlock,
        ...ubosRegistryProvidedBlock,
        ...directorsUserProvidedBlock,
        ...directorsRegistryProvidedBlock,
      ];
    }
  }

  return [];
};
