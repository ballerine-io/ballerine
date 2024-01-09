import { SheetContent, SheetTrigger } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { useCreateWorkflowMutation } from '@/domains/workflows/hooks/mutations/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { useCaseGenerationWorkflow } from '@/pages/Entities/components/CaseGeneration/hooks/useCaseGenerationWorkflow';
import { DynamicForm } from '@ballerine/ui';

const uiSchema = {
  data: {
    'ui:label': false,
    companyName: {
      'ui:title': 'Company Name',
    },
    additionalInfo: {
      'ui:label': false,
      companyName: {
        'ui:title': 'Hello World',
      },
      mainRepresentative: {
        'ui:label': false,
        'ui:order': ['email', 'firstName', 'lastName'],
        email: {
          'ui:title': 'Email',
        },
        firstName: {
          'ui:title': 'First Name',
        },
        lastName: {
          'ui:title': 'Last Name',
        },
      },
    },
  },
};

export const CaseGeneration = () => {
  const { workflow } = useCaseGenerationWorkflow();
  const { isLoading, mutate } = useCreateWorkflowMutation();

  console.log('SELECTED WORKFLOW', workflow?.workflowDefinition);

  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent side="right" style={{ top: 0, right: 0 }}>
        {workflow?.workflowDefinition.inputSchema ? (
          <DynamicForm
            uiSchema={uiSchema}
            schema={workflow?.workflowDefinition.inputSchema}
            disabled={isLoading}
            onSubmit={payload => {
              mutate({
                workflowDefinitionId: workflow?.workflowDefinition.id,
                context: {
                  entity: {
                    id: `my-user-${Date.now()}`,
                    type: 'business',
                    ...payload,
                  },
                  documents: [],
                },
                config: {
                  subscriptions: [
                    {
                      type: 'webhook',
                      url: 'https://webhook.site/3d2ff699-6b93-48a0-99e4-c69342e85c73',
                      events: ['workflow.completed'],
                    },
                  ],
                },
              });
            }}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
