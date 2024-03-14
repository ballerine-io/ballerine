import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { TCaseBlocksCreationProps } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/useCaseBlocks';

const createKycBlocks = (workflow: TWorkflowById) => {
  const blocks = createBlocksTyped().addBlock();

  const childWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
  );

  if (!childWorkflows?.length) return [];

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

const createAssociatedCompanyDocumentBlocks = (
  workflow: TWorkflowById,
  { onReuploadNeeded, isLoadingReuploadNeeded }: TCaseBlocksCreationProps,
) => {
  const blocks = createBlocksTyped().addBlock();

  const childWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );

  if (!childWorkflows?.length) return [];

  childWorkflows.forEach(childWorkflow => {
    blocks.addCell({
      type: 'nodeBlock',
      value: (
        <ChildDocumentBlocks
          parentWorkflowId={workflow.id}
          childWorkflow={childWorkflow}
          parentMachine={workflow?.context?.parentMachine}
          key={childWorkflow?.id}
          onReuploadNeeded={onReuploadNeeded}
          isLoadingReuploadNeeded={isLoadingReuploadNeeded}
        />
      ),
    });
  });

  return blocks.build();
};

export const getTabsToBlocksMap = (
  blocks: any[],
  blocksCreationParams: TCaseBlocksCreationProps,
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
      ...createKycBlocks(workflow as TWorkflowById),
      ...createAssociatedCompanyDocumentBlocks(workflow, blocksCreationParams),
    ],
    directors: [
      ...directorsUserProvidedBlock,
      ...directorsRegistryProvidedBlock,
      ...(createKycBlocks(workflow as TWorkflowById) || []),
    ],
  };
};
