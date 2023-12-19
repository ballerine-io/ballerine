import { FunctionComponent } from 'react';
import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { useKycBlock } from './hooks/useKycBlock/useKycBlock';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { BlocksComponent } from '@ballerine/blocks';

export const KycBlock: FunctionComponent<{
  parentWorkflowId: string;
  childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number];
}> = ({ parentWorkflowId, childWorkflow }) => {
  const childTasks = useKycBlock({
    parentWorkflowId,
    childWorkflow,
  });

  return (
    <BlocksComponent blocks={childTasks} cells={cells}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
