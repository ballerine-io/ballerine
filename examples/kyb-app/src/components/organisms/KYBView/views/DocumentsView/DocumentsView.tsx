import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useFileStorage } from '@app/common/providers/FileStorageProvider';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { DocumentsContext, KYBContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';
import { serializeBusinessData } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/serialize-business-data';
import { serializeWorkflowRunData } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/serialize-workflow-run-data';
import { updateBusiness } from '@app/domains/business';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';
import { useCallback } from 'react';

export const DocumentsView = () => {
  const { context, next } = useViewState<typeof kybViewSchema, KYBContext>();

  const { storage } = useFileStorage();

  const handleSubmit = useCallback(
    async (values: DocumentsContext): Promise<void> => {
      const serializedBusinessPayload = serializeBusinessData(values, context.shared.businessId);
      await updateBusiness(serializedBusinessPayload);

      const serializedRunPayload = await serializeWorkflowRunData(
        {
          ...context,
          documents: values,
        },
        storage,
      );

      await runAndStartWorkflowRequest(serializedRunPayload);
      next();
    },
    [context, storage, next],
  );

  return (
    <AppShell.FormContainer>
      <DynamicForm<DocumentsContext>
        className="max-w-[384px]"
        schema={formSchema}
        fileStorage={storage}
        uiSchema={{
          documents: {
            registrationCertificate: {
              'ui:field': 'FileInput',
            },
            addressProof: {
              'ui:field': 'FileInput',
            },
          },
        }}
        onSubmit={values => {
          void handleSubmit(values);
        }}
      />
    </AppShell.FormContainer>
  );
};
