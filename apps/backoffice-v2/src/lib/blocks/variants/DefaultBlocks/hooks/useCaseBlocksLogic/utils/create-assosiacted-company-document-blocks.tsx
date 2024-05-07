import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { TCaseBlocksCreationProps } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-tabs-block-map';

export const createAssociatedCompanyDocumentBlocks = (
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
      type: 'nodeCell',
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
