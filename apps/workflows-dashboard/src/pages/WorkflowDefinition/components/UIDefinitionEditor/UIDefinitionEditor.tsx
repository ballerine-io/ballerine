import { Button } from '@/components/atoms/Button';
import { DialogContent } from '@/components/atoms/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { JSONEditorComponent } from '@/components/organisms/JsonEditor';
import { IUIDefinition } from '@/domains/ui-definitions';
import { EditorCard } from '@/pages/WorkflowDefinition/components/EditorCard';
import { useUIDefinitionEditorTabs } from '@/pages/WorkflowDefinition/components/UIDefinitionEditor/hooks/useUIDefinitionEditorTabs';
import { useUIDefinitionElementUpdate } from '@/pages/WorkflowDefinition/components/UIDefinitionEditor/hooks/useUIDefinitionElementUpdate';
import { useUpgradeWorkflowDefinitionVersionMutation } from '@/pages/WorkflowDefinition/hooks/useUpgradeWorkflowDefinitionVersionMutation';
import { FunctionComponent, useMemo } from 'react';

interface UIDefinitionEditorProps {
  uiDefinition: IUIDefinition;
}

export const UIDefinitionEditor: FunctionComponent<UIDefinitionEditorProps> = ({
  uiDefinition,
}) => {
  const { uiSchema } = uiDefinition;
  const { tabValue, handleTabChange } = useUIDefinitionEditorTabs(uiSchema.elements);
  const { uiDefinitionValue, reset, handleUIDefinitionChange, handleElementChange, handleSave } =
    useUIDefinitionElementUpdate(uiDefinition.workflowDefinitionId, uiDefinition);
  const { mutate: upgradeVersion } = useUpgradeWorkflowDefinitionVersionMutation();

  const hasChanges = useMemo(
    () => JSON.stringify(uiDefinition) !== JSON.stringify(uiDefinitionValue),
    [uiDefinitionValue, uiDefinition],
  );

  return (
    <EditorCard
      title="UI Definition"
      value={uiDefinition}
      onOpenChange={open => {
        if (!open) {
          reset();
        }
      }}
      dialogContent={
        <DialogContent className="max-h-[90vh] min-h-[90vh] min-w-[90vw]">
          <Tabs
            onValueChange={handleTabChange}
            defaultValue="all"
            value={tabValue}
            className="flex h-full flex-col gap-2"
          >
            <TabsList className="flex w-full justify-center">
              <TabsTrigger value="all">All</TabsTrigger>
              {uiSchema.elements.map(element => {
                return (
                  <TabsTrigger value={element.stateName} key={element.stateName}>
                    {element.stateName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="all" className="flex-1">
              <JSONEditorComponent value={uiDefinitionValue} onChange={handleUIDefinitionChange} />
            </TabsContent>
            {uiSchema.elements.map(element => {
              return (
                <TabsContent value={element.stateName} key={element.stateName} className="flex-1">
                  <JSONEditorComponent value={element} onChange={handleElementChange} />
                </TabsContent>
              );
            })}
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  upgradeVersion({ workflowDefinitionId: uiDefinition.workflowDefinitionId })
                }
              >
                Upgrade
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </Tabs>
        </DialogContent>
      }
    />
  );
};
