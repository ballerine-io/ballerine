import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/useCaseBlocks';

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
      blocks: [...processTrackerBlock, ...entityInfoBlock],
    },
    {
      name: 'company_information',
      displayName: 'Full Company Information',
      blocks: [
        ...entityInfoBlock,
        ...registryInfoBlock,
        ...companySanctionsBlock,
        ...bankingDetailsBlock,
      ],
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
