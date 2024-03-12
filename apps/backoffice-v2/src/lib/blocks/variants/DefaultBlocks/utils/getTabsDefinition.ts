import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseTabs/useCaseTabs';

export const getTabsDefinition = (blocks: any[]) => {
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

  const tabs: TCaseTabDefinition[] = [
    {
      name: 'summary',
      displayName: 'Summary',
      blocks: [...processTrackerBlock, ...websiteMonitoringBlock, ...entityInfoBlock],
    },
    {
      name: 'company_information',
      displayName: 'Full Company Information',
      blocks: [...registryInfoBlock, ...kybRegistryInfoBlock, ...companySanctionsBlock],
    },
    {
      name: 'store_info',
      displayName: 'Store Info',
      blocks: [...storeInfoBlock],
    },
    {
      name: 'documents',
      displayName: 'Documents',
      blocks: [...parentDocumentBlocks, ...directorsDocumentsBlocks],
    },
    {
      name: 'individuals',
      displayName: 'Individuals',
      blocks: [
        ...ubosUserProvidedBlock,
        ...ubosRegistryProvidedBlock,
        ...directorsUserProvidedBlock,
        ...directorsRegistryProvidedBlock,
      ],
    },
  ];

  return tabs;
};
