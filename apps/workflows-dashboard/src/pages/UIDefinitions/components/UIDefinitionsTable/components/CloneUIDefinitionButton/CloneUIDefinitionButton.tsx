import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { useCloneUIDefinitionMutation } from '@/pages/UIDefinitions/hooks/useCloneUIDefinitionMutation';
import { DynamicForm } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

const formSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
  },
};

const uiSchema = {
  name: {
    'ui:placeholder': 'Enter name',
  },
};

interface ICLoneUIDefinitionButtonProps {
  uiDefinitionId: string;
}

export const CloneUIDefinitionButton: FunctionComponent<ICLoneUIDefinitionButtonProps> = ({
  uiDefinitionId,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate, isLoading, isSuccess } = useCloneUIDefinitionMutation();

  const handleSubmit = useCallback(
    async (formData: Record<string, any>) => {
      const values: { name: string } = formData as any;
      mutate({ uiDefinitionId, ...values });
    },
    [uiDefinitionId, mutate],
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
          schema={formSchema as RJSFSchema}
          uiSchema={uiSchema}
          disabled={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
