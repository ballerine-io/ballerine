import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { companyDocumentsSchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyDocumentsView/company-documents.schema.';
import { companyDocumetsUISchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyDocumentsView/company-documents.ui-schema';
import { DocumentsContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';

export const CompanyDocumentsView = () => {
  const { context, state, warnings, isLoading, save, finish } = useViewState<WorkflowFlowData>();

  const handleSubmit = useCallback(
    (values: DocumentsContext) => {
      void save(values).then(finalContext => {
        finish(finalContext);
      });
    },
    [save, finish],
  );

  const uiSchema = useMemo(() => {
    if (isLoading) {
      return {
        ...companyDocumetsUISchema,
        'ui:options': {
          ...companyDocumetsUISchema['ui:options'],
          submitButtonOptions: {
            ...companyDocumetsUISchema['ui:options'].submitButtonOptions,
            isLoading,
          },
        },
      };
    }

    return companyDocumetsUISchema;
  }, [isLoading]);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<DocumentsContext>
        className="max-w-[384px]"
        schema={companyDocumentsSchema}
        formData={context.flowData[state] as DocumentsContext}
        uiSchema={uiSchema}
        onSubmit={values => {
          void handleSubmit(values);
        }}
        warnings={warnings}
        disabled={isLoading}
      />
    </AppShell.FormContainer>
  );
};
