import { Button } from '@/components/atoms/Button';
import { DialogContent } from '@/components/atoms/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { JSONEditorComponent } from '@/components/organisms/JsonEditor';
import { IUIDefinition } from '@/domains/ui-definitions';
import { EditorCard } from '@/pages/WorkflowDefinition/components/EditorCard';
import { useUIDefinitionEditorTabs } from '@/pages/WorkflowDefinition/components/UIDefinitionEditor/hooks/useUIDefinitionEditorTabs';
import { useUIDefinitionElementUpdate } from '@/pages/WorkflowDefinition/components/UIDefinitionEditor/hooks/useUIDefinitionElementUpdate';
import { useUpgradeWorkflowDefinitionVersionMutation } from '@/pages/WorkflowDefinition/hooks/useUpgradeWorkflowDefinitionVersionMutation';
import { FunctionComponent } from 'react';

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

  return (
    <EditorCard
      title="UI Definition"
      value={uiDefinition}
      onOpenChange={open => {
        if (!open) {
          reset();
        }
      }}
      enableViewMode={true}
      viewDialogContent={
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            {uiDefinition.uiSchema.elements.map((element: any, index: number) => (
              <div
                key={element.stateName}
                className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{element.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">State: {element.stateName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {element.elements?.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Form Elements</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {element.elements.map((el: any, i: number) => {
                          // Helper function to render form elements
                          const renderFormElement = (element: any) => {
                            if (!element.type?.startsWith('json-form:')) return null;

                            const valueDestination = element.valueDestination?.split('.')?.pop();

                            return (
                              <div className="rounded-md bg-gray-50 p-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {valueDestination || element.name || element.type}
                                </div>
                                {element.options?.label && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    {element.options.label}
                                  </div>
                                )}
                              </div>
                            );
                          };

                          // Handle direct json-form elements
                          if (el.type?.startsWith('json-form:')) {
                            return <div key={i}>{renderFormElement(el)}</div>;
                          }

                          // Handle nested elements
                          if (el.elements) {
                            return (
                              <div key={i}>
                                {el.elements.map((nestedEl: any, j: number) => {
                                  if (nestedEl.type?.startsWith('json-form:')) {
                                    return <div key={j}>{renderFormElement(nestedEl)}</div>;
                                  }

                                  // Recursively check deeper nested elements
                                  if (nestedEl.elements) {
                                    return nestedEl.elements.map((deepEl: any, k: number) => {
                                      if (deepEl.type?.startsWith('json-form:')) {
                                        return (
                                          <div key={`${j}-${k}`}>{renderFormElement(deepEl)}</div>
                                        );
                                      }

                                      return null;
                                    });
                                  }

                                  return null;
                                })}
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  {element.actions?.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Actions</h4>
                      <div className="space-y-2">
                        {element.actions.map((action: any, i: number) => (
                          <div key={i} className="rounded-md bg-green-50 p-3">
                            <div className="text-sm font-medium text-green-900">
                              {action.type}
                              {action.params && (
                                <span className="ml-2 text-green-700">
                                  {action.params.eventName || action.params.pluginName}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {element.pageValidation?.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Validations</h4>
                      <div className="space-y-2">
                        {element.pageValidation.map((validation: any, i: number) => (
                          <div key={i} className="rounded-md bg-yellow-50 p-3">
                            <div className="text-sm font-medium text-yellow-900">
                              {validation.type}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      rawEditDialogContent={
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
            <TabsTrigger value="theme">theme</TabsTrigger>
            <TabsTrigger value="locales">locales</TabsTrigger>
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
          <TabsContent value="theme" className="flex-1">
            <JSONEditorComponent
              value={uiDefinitionValue.theme || {}}
              onChange={value =>
                handleUIDefinitionChange({
                  ...uiDefinitionValue,
                  theme: value,
                })
              }
            />
          </TabsContent>
          <TabsContent value="locales" className="flex-1">
            <JSONEditorComponent
              value={uiDefinitionValue.locales || {}}
              onChange={value =>
                handleUIDefinitionChange({
                  ...uiDefinitionValue,
                  locales: value,
                })
              }
            />
          </TabsContent>
          <div className="flex justify-end gap-2">
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
      }
    />
  );
};
