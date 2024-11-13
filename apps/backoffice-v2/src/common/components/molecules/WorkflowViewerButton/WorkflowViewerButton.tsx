import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';

import { useIsWorkflowViewerOpen } from '@/common/hooks/useIsWorkflowViewerOpen/useIsWorkflowViewerOpen';

interface IWorkflowViewerButtonProps {
  isDisabled?: boolean;
}

export const WorkflowViewerButton = ({ isDisabled = false }: IWorkflowViewerButtonProps) => {
  const isWorkflowViewerOpen = useIsWorkflowViewerOpen();

  return (
    <div className={`flex items-center space-x-2`}>
      <span className={`me-2 text-sm leading-6`}>Workflow</span>
      <Link
        className={`relative ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
        to={{
          search: isWorkflowViewerOpen(),
        }}
      >
        <GitBranch className={`d-5`} />
      </Link>
    </div>
  );
};
