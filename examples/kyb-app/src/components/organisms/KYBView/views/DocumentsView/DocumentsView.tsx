import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { DocumentsContext, KYBContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';
import { useCallback } from 'react';

export const DocumentsView = () => {
  const { context, state, saveAndPerformTransition } = useViewState<KYBContext>();

  const handleSubmit = useCallback(
    (values: DocumentsContext) => {
      void saveAndPerformTransition(values);
    },
    [saveAndPerformTransition],
  );

  return (
    <AppShell.FormContainer>
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
