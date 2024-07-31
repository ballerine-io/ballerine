import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import {
  formSchema,
  uiSchema,
} from '@/pages/WorkflowDefinitions/components/molecules/WorkflowDefinitionsTable/components/CloneWorkflowDefinitionButton/form-schema';
import { useCloneWorkflowDefinitionMutation } from '@/pages/WorkflowDefinitions/hooks/useCloneWorkflowDefinitionMutation';
import { DynamicForm } from '@ballerine/ui';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

interface ICloneWorkflowDefinitionButtonProps {
  workflowDefinitionId: string;
}

export const CloneWorkflowDefinitionButton: FunctionComponent<
  ICloneWorkflowDefinitionButtonProps
> = ({ workflowDefinitionId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate, isLoading, isSuccess } = useCloneWorkflowDefinitionMutation();

  const handleSubmit = useCallback(
    async (formData: Record<string, any>) => {
      const values: { name: string; displayName: string } = formData as any;

      mutate({ workflowDefinitionId, ...values });
    },
    [workflowDefinitionId, mutate],
  );

  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Clone</Button>
      </DialogTrigger>
      <DialogContent>
        <DynamicForm
          schema={formSchema}
          uiSchema={uiSchema}
          disabled={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
