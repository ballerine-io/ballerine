import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { EditorCard } from '@/pages/WorkflowDefinition/components/EditorCard';
import { useUpgradeWorkflowDefinitionVersionMutation } from '@/pages/WorkflowDefinition/hooks/useUpgradeWorkflowDefinitionVersionMutation';
import { useWorkflowDefinitionEdit } from '@/pages/WorkflowDefinition/hooks/useWorkflowDefinitionEdit';
import { FunctionComponent } from 'react';

interface WorkflowDefinitionEditorProps {
  workflowDefinition: IWorkflowDefinition;
}

export const WorkflowDefinitionEditor: FunctionComponent<WorkflowDefinitionEditorProps> = ({
  workflowDefinition,
}) => {
  const { workflowDefinitionValue, handleWorkflowDefinitionSave } =
    useWorkflowDefinitionEdit(workflowDefinition);
  const { mutate: upgradeWorkflowDefinitionVersion } =
    useUpgradeWorkflowDefinitionVersionMutation();

  return (
    <EditorCard
      title="Workflow Definition"
      value={workflowDefinitionValue || {}}
      onSave={
        workflowDefinitionValue
          ? definition => handleWorkflowDefinitionSave(definition as any)
          : undefined
      }
      onUpgrade={() =>
        upgradeWorkflowDefinitionVersion({ workflowDefinitionId: workflowDefinition.id })
      }
    />
  );
};
