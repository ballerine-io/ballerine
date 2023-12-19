import { useChildDocumentBlocksLogic } from '@/pages/Entity/components/ChildDocumentBlocks/hooks/useChildDocumentBlocksLogic/useChildDocumentBlocksLogic';
import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { UnknownRecord } from '@/common/types';

import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { BlocksComponent } from '@ballerine/blocks';

interface IChildDocumentBlocksProps {
  parentWorkflowId: string;
  childWorkflow: TWorkflowById['childWorkflows'][number];
  parentMachine: UnknownRecord;
}

export const ChildDocumentBlocks: FunctionComponent<IChildDocumentBlocksProps> = ({
  parentWorkflowId,
  childWorkflow,
  parentMachine,
}) => {
  const childDocumentBlocks = useChildDocumentBlocksLogic({
    parentWorkflowId,
    childWorkflow,
    parentMachine,
  });

  return (
    <BlocksComponent blocks={childDocumentBlocks} cells={cells}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
