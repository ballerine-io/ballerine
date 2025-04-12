import { Button } from '@/common/components/atoms/Button/Button';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { Edit } from 'lucide-react';
import { useIsCanEditCollectionFlow } from './hooks/useIsCanEditCollectionFlow';
import { useEditCollectionFlow } from './hooks/useEditCollectionFlow';

interface IEditCollectionFlowProps {
  workflow: TWorkflowById;
}

export const EditCollectionFlow = ({ workflow }: IEditCollectionFlowProps) => {
  const isCanEditCollectionFlow = useIsCanEditCollectionFlow({
    assigneeId: workflow.assigneeId || workflow.assignee?.id || '',
    tags: workflow.tags,
    config: workflow.workflowDefinition.config,
  });

  const { onEditCollectionFlow, isLoading } = useEditCollectionFlow({
    workflowId: workflow.id,
    workflowContext: workflow.context,
  });

  return (
    <DropdownMenuItem className={`w-full px-8 py-1`} asChild>
      <Button
        onClick={onEditCollectionFlow}
        variant={'ghost'}
        className="justify-start"
        disabled={!isCanEditCollectionFlow || isLoading}
      >
        <Edit size={18} className="mr-2" /> Edit Collection Flow
      </Button>
    </DropdownMenuItem>
  );
};
