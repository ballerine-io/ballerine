import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';
import { DocumentsContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useCallback } from 'react';

export const DocumentsView = () => {
  const { context, state, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  const handleSubmit = useCallback(
    (values: DocumentsContext) => {
      void saveAndPerformTransition(values);
    },
    [saveAndPerformTransition],
  );

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<DocumentsContext>
        className="max-w-[384px]"
        schema={formSchema}
        formData={context.flowData[state] as DocumentsContext}
        uiSchema={{
          registrationCertificate: {
            'ui:field': 'FileInput',
          },
          addressProof: {
            'ui:field': 'FileInput',
          },
        }}
        onSubmit={values => {
          void handleSubmit(values);
        }}
      />
    </AppShell.FormContainer>
  );
};
