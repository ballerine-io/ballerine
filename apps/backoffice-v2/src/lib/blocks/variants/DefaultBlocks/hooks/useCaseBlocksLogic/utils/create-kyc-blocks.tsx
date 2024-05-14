import { TWorkflowById } from '@/domains/workflows/fetchers';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const createKycBlocks = (workflow: TWorkflowById) => {
  const blocks = createBlocksTyped().addBlock();

  const childWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
  );

  if (!childWorkflows?.length) return [];

  childWorkflows.forEach(childWorkflow => {
    blocks.addCell({
      type: 'node',
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
