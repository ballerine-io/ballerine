import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { XstateVisualizer } from '@/components/organisms/XstateVisualizer';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { useWorkflowDefinitionQuery } from '@/pages/Workflows/hooks/useWorkflowDefinitionQuery';
import { NetworkIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  workflow: IWorkflow;
}

export const ViewWorkflow = ({ workflow }: Props) => {
  const [isDialogOpen, setOpen] = useState(false);
  const { data } = useWorkflowDefinitionQuery(
    isDialogOpen ? workflow.workflowDefinitionId : undefined,
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <NetworkIcon size={'16'} />
          Show Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] min-w-[80vw] overflow-hidden">
        {data ? (
          <div className="h-full w-full overflow-hidden p-4">
            <XstateVisualizer stateDefinition={data} state={workflow.state || ''} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
