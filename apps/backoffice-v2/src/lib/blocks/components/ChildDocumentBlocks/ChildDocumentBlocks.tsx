import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { UnknownRecord } from '@/common/types';
import { useChildDocumentBlocksLogic } from '@/lib/blocks/components/ChildDocumentBlocks/hooks/useChildDocumentBlocksLogic/useChildDocumentBlocksLogic';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { BlocksComponent } from '@ballerine/blocks';

interface IChildDocumentBlocksProps {
  parentWorkflowId: string;
  childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number];
  parentMachine: UnknownRecord;
  onReuploadNeeded: ({
    workflowId,
    documentId,
    reason,
  }: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
}

export const ChildDocumentBlocks: FunctionComponent<IChildDocumentBlocksProps> = ({
  parentWorkflowId,
  childWorkflow,
  parentMachine,
  onReuploadNeeded,
  isLoadingReuploadNeeded,
}) => {
  const childDocumentBlocks = useChildDocumentBlocksLogic({
    parentWorkflowId,
    childWorkflow,
    parentMachine,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
  });

  return (
    <BlocksComponent blocks={childDocumentBlocks} cells={cells}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
