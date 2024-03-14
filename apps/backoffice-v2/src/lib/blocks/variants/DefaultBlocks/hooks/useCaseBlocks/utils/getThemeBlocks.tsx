import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { TCaseBlocksParams } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/useCaseBlocks';
import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

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

export const getThemeBlocks = (
  blocks: any[],
  theme: WorkflowDefinitionConfigTheme,
  activeTab: TCaseTabDefinition,
  { workflow }: TCaseBlocksParams,
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
      return [
        ...registryInfoBlock,
        ...kybRegistryInfoBlock,
        ...companySanctionsBlock,
        ...bankingDetailsBlock,
      ];
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
        ...(createKycBlocks(workflow as TWorkflowById) || []),
      ];
    }
  }

  return [];
};
