import { TWorkflowById } from '@/domains/workflows/fetchers';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { TCaseBlocksParams } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/useCaseBlocks';

const createKycBlocks = (workflow: TWorkflowById) => {
  const blocks = createBlocksTyped().addBlock();

  const childWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
  );

  if (!childWorkflows?.length) return;

  childWorkflows.forEach(childWorkflow => {
    blocks.addCell({
      type: 'nodeBlock',
      value: (
        <KycBlock
          parentWorkflowId={workflow.id}
          childWorkflow={childWorkflow}
          key={childWorkflow?.id}
        />
      ),
    });
  });

  return blocks.build();
};

export const getTabsToBlocksMap = (blocks: any[], { workflow }: TCaseBlocksParams) => {
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

  return {
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
      ...(createKycBlocks(workflow as TWorkflowById) || []),
    ],
    directors: [
      ...directorsUserProvidedBlock,
      ...directorsRegistryProvidedBlock,
      ...(createKycBlocks(workflow as TWorkflowById) || []),
    ],
  };
};
