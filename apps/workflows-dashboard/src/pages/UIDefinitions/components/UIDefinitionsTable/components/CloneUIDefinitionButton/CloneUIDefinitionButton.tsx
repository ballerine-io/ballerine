import { Button } from '@/components/atoms/Button';
import { useCloneUIDefinitionMutation } from '@/pages/UIDefinitions/hooks/useCloneUIDefinitionMutation';
import { FunctionComponent } from 'react';

interface ICLoneUIDefinitionButtonProps {
  uiDefinitionId: string;
}

export const CloneUIDefinitionButton: FunctionComponent<ICLoneUIDefinitionButtonProps> = ({
  uiDefinitionId,
}) => {
  const { mutate, isLoading } = useCloneUIDefinitionMutation();

  return (
    <Button onClick={() => mutate({ uiDefinitionId })} disabled={isLoading}>
      Clone
    </Button>
  );
};
