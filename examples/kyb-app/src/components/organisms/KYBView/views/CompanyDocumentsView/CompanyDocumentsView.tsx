import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { companyDocumentsSchema } from '@app/components/organisms/KYBView/views/CompanyDocumentsView/company-documents.schema.';
import { companyDocumetsUISchema } from '@app/components/organisms/KYBView/views/CompanyDocumentsView/company-documents.ui-schema';
import { DocumentsContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useCallback } from 'react';

export const CompanyDocumentsView = () => {
  const { context, state, warnings, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

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
        schema={companyDocumentsSchema}
        formData={context.flowData[state] as DocumentsContext}
        uiSchema={companyDocumetsUISchema}
        onSubmit={values => {
          void handleSubmit(values);
        }}
        warnings={warnings}
      />
    </AppShell.FormContainer>
  );
};
